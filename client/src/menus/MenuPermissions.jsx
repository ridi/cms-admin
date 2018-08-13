import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import cn from 'classnames';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { SortableTreeWithoutDndContext as SortableTree } from 'react-sortable-tree';
import { getPassThroughProps } from '../utils/component';
import { handleError } from '../utils/error';
import SpinnerOverlay from '../components/SpinnerOverlay';
import './MenuPermissions.css';

class MenuPermissions extends React.Component {
  state = {
    treeData: [],
    isFetching: false,
  };

  loadPermissions = () => {
    this.setState({ isFetching: true }, async () => {
      try {
        const { menuId } = this.props;
        const { data } = await axios.get(`/super/menus/${menuId}/permissions`);
        const treeData = [{
          ...data,
          title: data.menu_title,
          subtitle: data.menu_url,
          expanded: true,
          children: [
            ..._.map(data.tags, tag => ({
              ...tag,
              title: tag.display_name,
              children: [
                ..._.map(tag.groups, group => ({
                  ...group,
                  title: group.name,
                  children: _.map(group.users, user => ({
                    ...user,
                    title: user.name,
                    subtitle: user.id,
                  })),
                })),
                ..._.map(tag.users, user => ({
                  ...user,
                  title: user.name,
                  subtitle: user.id,
                })),
              ],
            })),
            ..._.map(data.users, user => ({
              ...user,
              title: user.name,
              subtitle: user.id,
            })),
          ],
        }];
        this.setState({ treeData });
      } catch (e) {
        handleError(e);
      } finally {
        this.setState({ isFetching: false });
      }
    });
  };

  unloadPermissions = () => {
    this.setState({ treeData: [] });
  };

  onSortableTreeChange = (treeData) => {
    this.setState({ treeData });
  };

  render = () => {
    const {
      className,
      show,
      onHide,
    } = this.props;

    const {
      treeData,
      isFetching,
    } = this.state;

    return (
      <Modal
        className={cn('menu_permissions', className)}
        show={show}
        onHide={onHide}
        onEnter={this.loadPermissions}
        onExited={this.unloadPermissions}
        {...getPassThroughProps(this)}
      >
        <Modal.Header closeButton>
          <Modal.Title>메뉴 권한</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SortableTree
            treeData={treeData}
            canDrag={() => false}
            onChange={this.onSortableTreeChange}
          />
          <SpinnerOverlay show={isFetching} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  };
}

MenuPermissions.propTypes = {
  ...Modal.propTypes,
  className: PropTypes.string,
  menuId: PropTypes.number,
};

MenuPermissions.defaultProps = {
  ...Modal.defaultProps,
  className: undefined,
  menuId: undefined,
};

export default MenuPermissions;
