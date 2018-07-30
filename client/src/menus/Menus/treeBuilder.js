export const buildMenuTrees = (menus) => {
  const rootNode = {
    id: 0,
    depth: -1,
    children: [],
  };
  const parents = [rootNode];

  _.forEach(menus, (menu, index) => {
    const parent = (() => {
      while (_.last(parents).depth >= menu.depth) {
        parents.pop();
      }
      return _.last(parents);
    })();

    const node = {
      ...menu,
      children: [],
    };
    parent.children.push(node);

    if (menu === _.last(menus)) {
      return;
    }

    if (menus[index + 1].depth > menu.depth) {
      parents.push(node);
    }
  });

  return rootNode.children;
};

export const flattenMenuTrees = (nodes) => {
  return _.flatMapDeep(nodes, node => [
    _.omit(node, 'children'),
    flattenMenuTrees(node.children),
  ]);
};
