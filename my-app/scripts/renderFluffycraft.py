# Renders the Fluffycraft .bbmodel files to transparent PNGs for the Assets page.
#
#   blender -b --factory-startup -P scripts/renderFluffycraft.py -- <FluffycraftMod dir> <out dir> [--sweep]
#
# --sweep renders every model from 8 yaws (<slug>_<yaw>.png), for choosing the yaw/pitch in MODELS.
import base64
import json
import math
import os
import sys
import tempfile

import bpy
from mathutils import Matrix, Vector

# slug: (bbmodel, yaw, pitch). Yaw 0 looks at the model's north (-Z) side.
MODELS = {
    'beaver': ('beaver', 315, 20),
    'capybara': ('Capybara', 315, 20),
    'grubby': ('Grubby', 135, 30),
    'hyrax': ('Hyrax', 45, 20),
    'louse': ('louse', 315, 20),
    'mamabeak': ('Mamabeak', 315, 20),
    'slitherwing': ('slitherwing', 315, 20),
    'capybara_plushie': ('Capy', 225, 20),
    'defect_plushie': ('Defect', 225, 20),
    'sheep_plushie': ('sheep_baby', 315, 20),
    'silent_plushie': ('Silent', 225, 20),
    'glass_rose': ('glass_rose', 25, 20),
}
# The .bbmodel left these cubes on the wrong UVs; the mod's Java models use the sibling's UVs.
FACE_FIXES = {'Capybara': {'leg3': 'leg4'}}
SIZE = 600
SWEEP_SIZE = 256

args = sys.argv[sys.argv.index('--') + 1:]
mod_dir, out_dir = args[0], os.path.abspath(args[1])  # Blender misresolves relative render paths
sweep = '--sweep' in args
entity_dir = os.path.join(mod_dir, 'src/main/resources/assets/fluffycraft/textures/entity')
tmp_dir = tempfile.mkdtemp()
os.makedirs(out_dir, exist_ok=True)


def rotation(rot):
    # Blockbench uses Euler order ZYX, so X is applied first.
    x, y, z = (math.radians(a) for a in rot)
    return Matrix.Rotation(z, 4, 'Z') @ Matrix.Rotation(y, 4, 'Y') @ Matrix.Rotation(x, 4, 'X')


def pivot(node):
    origin = Vector(node.get('origin') or (0, 0, 0))
    return Matrix.Translation(origin) @ rotation(node.get('rotation') or (0, 0, 0)) @ Matrix.Translation(-origin)


def face_corners(a, b, name):
    # Corners in UV order (top-left, top-right, bottom-right, bottom-left) seen from outside.
    x0, y0, z0 = a
    x1, y1, z1 = b
    return {
        'north': [(x1, y1, z0), (x0, y1, z0), (x0, y0, z0), (x1, y0, z0)],
        'south': [(x0, y1, z1), (x1, y1, z1), (x1, y0, z1), (x0, y0, z1)],
        'east': [(x1, y1, z1), (x1, y1, z0), (x1, y0, z0), (x1, y0, z1)],
        'west': [(x0, y1, z0), (x0, y1, z1), (x0, y0, z1), (x0, y0, z0)],
        'up': [(x0, y1, z0), (x1, y1, z0), (x1, y1, z1), (x0, y1, z1)],
        'down': [(x0, y0, z1), (x1, y0, z1), (x1, y0, z0), (x0, y0, z0)],
    }[name]


def walk(nodes, groups, elements, parent, out):
    for node in nodes:
        if isinstance(node, str):
            if node in elements:
                out.append((elements[node], parent))
        else:
            group = groups.get(node['uuid'], node)
            walk(node.get('children', []), groups, elements, parent @ pivot(group), out)


def load_texture(model):
    # Slot 0 is the wild skin. Prefer the shipped PNG: some embedded copies are stale.
    tex = model['textures'][0]
    path = os.path.join(entity_dir, tex['name'])
    if not os.path.exists(path):
        path = os.path.join(tmp_dir, tex['name'])
        with open(path, 'wb') as f:
            f.write(base64.b64decode(tex['source'].split(',', 1)[1]))
    return bpy.data.images.load(path), tex.get('uv_width') or tex['width'], tex.get('uv_height') or tex['height']


def make_material(image):
    mat = bpy.data.materials.new('skin')
    mat.use_nodes = True
    mat.use_backface_culling = True  # zero-thickness planes would z-fight otherwise
    mat.surface_render_method = 'DITHERED'  # BLENDED doesn't depth-sort within a mesh
    nodes = mat.node_tree.nodes
    bsdf = nodes['Principled BSDF']
    bsdf.inputs['Roughness'].default_value = 1
    bsdf.inputs['Specular IOR Level'].default_value = 0
    tex = nodes.new('ShaderNodeTexImage')
    tex.image = image
    tex.interpolation = 'Closest'
    mat.node_tree.links.new(tex.outputs['Color'], bsdf.inputs['Base Color'])
    mat.node_tree.links.new(tex.outputs['Alpha'], bsdf.inputs['Alpha'])
    return mat


def build(path):
    with open(path, encoding='utf8') as f:
        model = json.load(f)
    image, uv_w, uv_h = load_texture(model)
    elements = {e['uuid']: e for e in model['elements']}
    by_name = {e['name']: e for e in model['elements']}
    for broken, source in FACE_FIXES.get(model['name'], {}).items():
        by_name[broken]['faces'] = by_name[source]['faces']
    groups = {g['uuid']: g for g in model.get('groups') or []}
    placed = []
    walk(model['outliner'], groups, elements, Matrix.Identity(4), placed)

    verts, faces, uvs = [], [], []
    for element, parent in placed:
        inflate = element.get('inflate', 0)
        a = [v - inflate for v in element['from']]
        b = [v + inflate for v in element['to']]
        matrix = parent @ pivot(element)
        for name, face in element['faces'].items():
            if face.get('texture') is None:
                continue
            u0, v0, u1, v1 = face['uv']
            if u0 == u1 or v0 == v1:
                continue
            corners = [matrix @ Vector(c) for c in face_corners(a, b, name)]
            face_uvs = [(u0, v0), (u1, v0), (u1, v1), (u0, v1)]
            # Reversed so the winding is counter-clockwise from outside; MC (x,y,z) -> Blender (x,-z,y).
            start = len(verts)
            verts += [Vector((c.x, -c.z, c.y)) for c in reversed(corners)]
            uvs += [(u / uv_w, 1 - v / uv_h) for u, v in reversed(face_uvs)]
            faces.append(range(start, start + 4))

    mesh = bpy.data.meshes.new('model')
    mesh.from_pydata(verts, [], [list(f) for f in faces])
    layer = mesh.uv_layers.new()
    for i, loop in enumerate(mesh.loops):
        layer.data[i].uv = uvs[loop.vertex_index]
    mesh.materials.append(make_material(image))
    obj = bpy.data.objects.new('model', mesh)
    bpy.context.scene.collection.objects.link(obj)
    return obj, verts


def frame(camera, sun, verts, yaw, pitch):
    y, p = math.radians(yaw), math.radians(pitch)
    # Yaw 0 sits on the model's north side, which is +Y in Blender.
    back = Vector((math.sin(y) * math.cos(p), math.cos(y) * math.cos(p), math.sin(p)))
    right = Vector((0, 0, 1)).cross(back).normalized()
    up = back.cross(right)
    xs = [v.dot(right) for v in verts]
    ys = [v.dot(up) for v in verts]
    centre = right * (min(xs) + max(xs)) / 2 + up * (min(ys) + max(ys)) / 2
    camera.location = centre + back * 500
    camera.rotation_euler = back.to_track_quat('Z', 'Y').to_euler()
    camera.data.ortho_scale = max(max(xs) - min(xs), max(ys) - min(ys)) * 1.1
    # Key light stays over the camera's left shoulder whatever the yaw.
    sun.rotation_euler = (back + up * 0.8 - right * 0.6).to_track_quat('Z', 'Y').to_euler()


scene = bpy.context.scene
for obj in list(scene.objects):
    bpy.data.objects.remove(obj)
scene.render.engine = 'BLENDER_EEVEE'
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.view_settings.view_transform = 'Standard'  # Filmic/AgX would wash out the pixel art
scene.world = bpy.data.worlds.new('ambient')
scene.world.use_nodes = True
scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value = 1.1

camera = bpy.data.objects.new('camera', bpy.data.cameras.new('camera'))
camera.data.type = 'ORTHO'
camera.data.clip_end = 2000
sun = bpy.data.objects.new('sun', bpy.data.lights.new('sun', 'SUN'))
sun.data.energy = 0.9
sun.data.use_shadow = False  # flat Minecraft-style face shading; soft shadows smear across the cubes
scene.collection.objects.link(camera)
scene.collection.objects.link(sun)
scene.camera = camera

for slug, (name, yaw, pitch) in MODELS.items():
    obj, verts = build(os.path.join(mod_dir, 'art/models', name + '.bbmodel'))
    shots = [(f'{slug}_{a:03d}', a, 20) for a in range(0, 360, 45)] if sweep else [(slug, yaw, pitch)]
    scene.render.resolution_x = scene.render.resolution_y = SWEEP_SIZE if sweep else SIZE
    for filename, a, p in shots:
        frame(camera, sun, verts, a, p)
        scene.render.filepath = os.path.join(out_dir, filename + '.png')
        bpy.ops.render.render(write_still=True)
    bpy.data.objects.remove(obj)
