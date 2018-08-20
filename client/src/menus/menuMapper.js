export const mapRawMenuToMenu = (rawMenu) => ({
  id: rawMenu.id,
  title: rawMenu.menu_title,
  url: rawMenu.menu_url,
  depth: rawMenu.menu_deep,
  order: rawMenu.menu_order,
  isNewTab: rawMenu.is_newtab,
  isUse: rawMenu.is_use,
  isShow: rawMenu.is_show,
});

export const mapMenuToRawMenu = (menu) => ({
  id: menu.id,
  menu_title: menu.title,
  menu_url: menu.url,
  menu_deep: menu.depth,
  menu_order: menu.order,
  is_newtab: menu.isNewTab,
  is_use: menu.isUse,
  is_show: menu.isShow,
});
