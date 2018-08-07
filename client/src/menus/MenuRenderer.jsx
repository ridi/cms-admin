import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import cn from 'classnames';
import { Button, Glyphicon, OverlayTrigger, Popover, Table } from 'react-bootstrap';
import AutosizeInput from 'react-input-autosize';
import { mapMenuToRawMenu } from './menuMapper';
import './MenuRenderer.css';

const PropTextInput = ({
  menu,
  path,
  propKey,
  className,
  children,
  placeholder,
  onChange,
  ...props
}) => (
  <div className={cn(_.snakeCase(propKey), 'menu_tree__menu__prop_text_input', className)} {...props}>
    <AutosizeInput
      value={menu[propKey]}
      placeholder={placeholder}
      onChange={(event) => onChange({
        ...menu,
        [propKey]: event.target.value,
      }, path)}
    />
    {children}
  </div>
);

const PropCheckbox = ({
  menu,
  path,
  propKey,
  className,
  children,
  placeholder,
  onChange,
  ...props
}) => (
  <label className={cn(_.snakeCase(propKey), 'menu_tree__menu__prop_checkbox', className)} {...props}>
    <input
      type="checkbox"
      checked={menu[propKey]}
      placeholder={placeholder}
      onChange={(event) => onChange({
        ...menu,
        [propKey]: event.target.checked,
      }, path)}
    />
    {children}
  </label>
);

const MenuDetails = ({ menu, originalMenu = {}, className, ...props }) => {
  const rawMenu = mapMenuToRawMenu(menu);
  const originalRawMenu = mapMenuToRawMenu(originalMenu);

  const created = menu.isCreated;
  if (created) {
    rawMenu.id = undefined;
  }

  return (
    <Table
      className={cn(
        'menu_tree__menu__menu_details',
        { created },
        className,
      )}
      condensed
      hover
      {...props}
    >
      <tbody>
        {_.map(rawMenu, (value, key) => {
          const originalValue = originalRawMenu[key];
          const modified = !created && value !== originalValue;

          return (
            <tr key={key} className={cn({ modified })}>
              <td className="key">{key}</td>
              <td className="value">
                {modified ? (
                  <React.Fragment>
                    <span className="original">{String(originalRawMenu[key])}</span>
                    <span className="new">{String(rawMenu[key])}</span>
                  </React.Fragment>
                ) : (
                  String(rawMenu[key])
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

class MenuRenderer extends React.Component {
  render = () => {
    const {
      container,
      menu,
      originalMenu,
      path,
      handle,
      onChange,
      onShowSubmenusButtonClick,
      onShowUsersButtonClick,
      onRemoveButtonClick,
      ...props
    } = this.props;

    const inputProps = {
      menu,
      path,
      onChange,
    };

    const className = cn(
      'menu_tree__menu',
      'panel',
      'panel-default', {
        is_new_tab: menu.isNewTab,
        is_use: menu.isUse,
        is_show: menu.isShow,
      }, {
        created: menu.isCreated,
        unsaved: menu.isUnsaved,
      },
    );

    const message = menu.isCreated ? '추가됨' : menu.isUnsaved ? '변경됨' : '';

    return (
      <div className={className} {...props}>
        {handle}

        <div className="menu_tree__menu__title_container">
          <PropTextInput {...inputProps} propKey="title" placeholder="메뉴 제목" />
          <PropTextInput {...inputProps} propKey="url" placeholder="메뉴 URL" />
        </div>

        <div className="menu_tree__menu__checkbox_group">
          <PropCheckbox {...inputProps} propKey="isNewTab">새 탭</PropCheckbox>
          <PropCheckbox {...inputProps} propKey="isUse">사용</PropCheckbox>
          <PropCheckbox {...inputProps} propKey="isShow">노출</PropCheckbox>
        </div>

        <div className="menu_tree__menu__button_group btn-group-xs">
          <Button onClick={() => onShowSubmenusButtonClick(menu)}>Ajax 관리</Button>
          <Button onClick={() => onShowUsersButtonClick(menu)}>사용자 보기</Button>
          {menu.isCreated && (
            <Button bsStyle="danger" onClick={() => onRemoveButtonClick(menu, path)}>삭제</Button>
          )}
        </div>

        <OverlayTrigger
          rootClose
          trigger="click"
          container={container}
          overlay={
            <Popover
              id={`menu_tree__menu__popover_${menu.id}`}
              className="menu_tree__menu__popover"
            >
              <MenuDetails menu={menu} originalMenu={originalMenu} />
            </Popover>
          }
        >
          <div className="menu_tree__menu__status">
            {message && (
              <span className="menu_tree__menu__message">
                {message}
              </span>
            )}
            <Glyphicon glyph="info-sign" />
          </div>
        </OverlayTrigger>
      </div>
    );
  };
}

MenuRenderer.propTypes = {
  container: PropTypes.shape({}).isRequired,
  menu: PropTypes.shape({}).isRequired,
  originalMenu: PropTypes.shape({}),
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ).isRequired,
  handle: PropTypes.node.isRequired,

  onChange: PropTypes.func.isRequired,
  onShowSubmenusButtonClick: PropTypes.func.isRequired,
  onShowUsersButtonClick: PropTypes.func.isRequired,
  onRemoveButtonClick: PropTypes.func.isRequired,
};

MenuRenderer.defaultProps = {
  originalMenu: undefined,
};

export default MenuRenderer;
