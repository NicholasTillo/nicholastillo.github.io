import './basepages.css'
import './assets.css'
import beaver from '../Assets/fluffycraft/beaver.png'
import capybara from '../Assets/fluffycraft/capybara.png'
import capybaraPlushie from '../Assets/fluffycraft/capybara_plushie.png'
import defectPlushie from '../Assets/fluffycraft/defect_plushie.png'
import glassRose from '../Assets/fluffycraft/glass_rose.png'
import grubby from '../Assets/fluffycraft/grubby.png'
import hyrax from '../Assets/fluffycraft/hyrax.png'
import louse from '../Assets/fluffycraft/louse.png'
import mamabeak from '../Assets/fluffycraft/mamabeak.png'
import sheepPlushie from '../Assets/fluffycraft/sheep_plushie.png'
import silentPlushie from '../Assets/fluffycraft/silent_plushie.png'
import slitherwing from '../Assets/fluffycraft/slitherwing.png'

export const mobs = [
  ['Beaver', beaver],
  ['Capybara', capybara],
  ['Grubby', grubby],
  ['Hyrax', hyrax],
  ['Louse', louse],
  ['Mamabeak', mamabeak],
  ['Slitherwing', slitherwing],
];

const blocks = [
  ['Capybara Plushie', capybaraPlushie],
  ['Defect Plushie', defectPlushie],
  ['Sheep Plushie', sheepPlushie],
  ['Silent Plushie', silentPlushie],
  ['Glass Rose', glassRose],
];

export function ModelGrid({ models }) {
  return (
    <div className="assetGrid">
      {models.map(([name, src]) => (
        <figure className="assetCard" key={name}>
          <img src={src} alt={`3D render of the ${name} model`} loading="lazy" />
          <figcaption>{name}</figcaption>
        </figure>
      ))}
    </div>
  );
}

export default function Assets() {
  return (
    <div className="mainBody">
      <h1 className="PageTitle">Game Assets</h1>
      <p>Custom made models, assets, animations and anything else I make for my games and mods.</p>
      <p>3D models I built in Blockbench for Fluffycraft, my Minecraft mod.</p>
      <div className="seperator"></div>
      <h2>Mobs</h2>
      <ModelGrid models={mobs} />
      <div className="seperator"></div>
      <h2>Plushies &amp; Blocks</h2>
      <ModelGrid models={blocks} />
    </div>
  );
}
