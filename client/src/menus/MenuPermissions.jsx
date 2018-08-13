import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import cn from 'classnames';
import axios from 'axios';
import { Button, Glyphicon, Label, Modal, Tab, Tabs, Table } from 'react-bootstrap';
import { getPassThroughProps } from '../utils/component';
import { handleError } from '../utils/error';
import SpinnerOverlay from '../components/SpinnerOverlay';
import './MenuPermissions.css';

class MenuPermissions extends React.Component {
  static TabKeys = {
    TAGS: 'tags',
    GROUPS: 'groups',
    USERS: 'users',
  };

  static defaultState = {
    data: {
      tags: [],
      groups: [],
      users: [],
    },
    activeTabKey: MenuPermissions.TabKeys.USERS,
    isFetching: false,
  };

  state = MenuPermissions.defaultState;

  loadData = () => {
    this.setState({ isFetching: true }, async () => {
      try {
        const { menuId } = this.props;
        const { data: menu } = await axios.get(`/super/menus/${menuId}/permissions`);

        const allTags = menu.tags;
        const tags = _.flow([
          tags => _.sortBy(tags, [tag => !tag.is_use, 'display_name']),
        ])(allTags);

        const allGroups = _.flatMap(tags, tag => tag.groups);
        const groups = _.flow([
          groups => _.uniqBy(groups, 'id'),
          groups => _.sortBy(groups, [group => !group.is_use, 'name']),
          groups => _.map(groups, group => ({
            ...group,
            tags: _.filter(tags, tag => _.find(tag.groups, value => value.id === group.id)),
          })),
        ])(allGroups);

        const allUsers = [
          ...menu.users,
          ..._.flatMap(tags, tag => tag.users),
          ..._.flatMap(groups, group => group.users),
        ];
        const users = _.flow([
          users => _.uniqBy(users, 'id'),
          users => _.sortBy(users, [user => !user.is_use, 'name']),
          users => _.map(users, user => ({
            ...user,
            hasDirectPermission: !!_.find(menu.users, value => value.id === user.id),
            tags: _.filter(tags, tag => _.find(tag.users, value => value.id === user.id)),
            groups: _.filter(groups, group => _.find(group.users, value => value.id === user.id)),
          })),
        ])(allUsers);

        const data = {
          tags,
          groups,
          users,
        };

        this.setState({ data });
      } catch (e) {
        handleError(e);
      } finally {
        this.setState({ isFetching: false });
      }
    });
  };

  unloadData = () => {
    this.setState({ data: MenuPermissions.defaultState.data });
  };

  handleSelect = activeTabKey => {
    this.setState({ activeTabKey });
  };

  render = () => {
    const {
      className,
      show,
      onHide,
    } = this.props;

    const {
      data,
      activeTabKey,
      isFetching,
    } = this.state;

    return (
      <Modal
        className={cn('menu_permissions', className)}
        bsSize="large"
        show={show}
        onHide={onHide}
        onEnter={this.loadData}
        onExited={this.unloadData}
        {...getPassThroughProps(this)}
      >
        <Modal.Header closeButton>
          <Modal.Title>메뉴 권한</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Tabs
            id="menu_permission_tabs"
            activeKey={activeTabKey}
            animation={false}
            onSelect={this.handleSelect}
          >
            <Tab eventKey={MenuPermissions.TabKeys.TAGS} title={`태그 (${_.size(data.tags)})`}>
              <Table striped condensed hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>이름</th>
                  </tr>
                </thead>
                <tbody>
                  {_.map(data.tags, tag => (
                    <tr key={tag.id} className={cn('tag', { use: tag.is_use })}>
                      <td>{tag.id}</td>
                      <td>
                        <Label bsStyle="primary">
                          {tag.display_name}
                        </Label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>

            <Tab eventKey={MenuPermissions.TabKeys.GROUPS} title={`그룹 (${_.size(data.groups)})`}>
              <Table striped condensed hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>이름</th>
                    <th>태그 권한</th>
                  </tr>
                </thead>
                <tbody>
                  {_.map(data.groups, group => (
                    <tr key={group.id} className={cn('group', { use: group.is_use })}>
                      <td>{group.id}</td>
                      <td>
                        <Label bsStyle="success">
                          {group.name}
                        </Label>
                      </td>
                      <td>
                        {_.map(group.tags, tag => (
                          <Label key={tag.id} bsStyle="primary">{tag.display_name}</Label>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>

            <Tab eventKey={MenuPermissions.TabKeys.USERS} title={`사용자 (${_.size(data.users)})`}>
              <Table striped condensed hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>이름</th>
                    <th>직접 권한</th>
                    <th>태그 권한</th>
                    <th>그룹 권한</th>
                  </tr>
                </thead>
                <tbody>
                  {_.map(data.users, user => (
                    <tr key={user.id} className={cn('user', { use: user.is_use })}>
                      <td>{user.id}</td>
                      <td>
                        <a href={`/super/users/${user.id}`} target="_blank">
                          <Label>
                            {user.name}
                          </Label>
                        </a>
                      </td>
                      <td>
                        {user.hasDirectPermission && (
                          <Glyphicon glyph="ok" />
                        )}
                      </td>
                      <td>
                        {_.map(user.tags, tag => (
                          <Label key={tag.id} bsStyle="primary">{tag.display_name}</Label>
                        ))}
                      </td>
                      <td>
                        {_.map(user.groups, group => (
                          <Label key={group.id} bsStyle="success">{group.name}</Label>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>
          </Tabs>
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
