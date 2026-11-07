import { categories, projects } from './projects';

test('slugs are unique', () => {
  const slugs = projects.map((p) => p.slug);
  expect(new Set(slugs).size).toBe(slugs.length);
});

test('every category features exactly 3 projects', () => {
  categories.forEach(({ id }) => {
    expect(projects.filter((p) => p.category === id && p.featured)).toHaveLength(3);
  });
});

test('every project has somewhere to go and something to show', () => {
  projects.forEach((p) => {
    expect(Boolean(p.text) !== Boolean(p.href)).toBe(true);
    expect(p.featured ? p.summary : p.keywords).toBeTruthy();
    expect(p.images.length).toBeGreaterThan(0);
  });
});
