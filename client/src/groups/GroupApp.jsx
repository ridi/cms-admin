import React from 'react';
import PropTypes from 'prop-types';
import GroupCreator from './GroupCreator';
import GroupList from './GroupList';
import MenusDialog from '../tags/MenusDialog';
import UsersDialog from '../tags/UsersDialog';

export default class GroupApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      groups: props.groups,
      showTagsDlg: false,
      showUsersDlg: false,
      tags: [],
      assignedTags: null,
      assignedUsers: null,
      selectedGroupId: 0,
    };

    this.handleShowTagsDlg = this.handleShowTagsDlg.bind(this);
    this.handleCloseTagsDlg = this.handleCloseTagsDlg.bind(this);
    this.handleShowUsersDlg = this.handleShowUsersDlg.bind(this);
    this.handleCloseUsersDlg = this.handleCloseUsersDlg.bind(this);
    this.handleCreateGroup = this.handleCreateGroup.bind(this);
    this.handleAddTag = this.handleAddTag.bind(this);
    this.handleDeleteTag = this.handleDeleteTag.bind(this);
    this.fetchTagsForGroup = this.fetchTagsForGroup.bind(this);
    this.fetchAllTags = this.fetchAllTags.bind(this);
    this.fetchUsersForGroup = this.fetchUsersForGroup.bind(this);
  }

  componentDidMount() {
    this.fetchAllTags();
  }

  handleCreateGroup(name, isUse) {
    const data = {
      name,
      is_use: isUse,
    };

    fetch('/super/groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    }).then(() => {
      window.location.reload();
    });
  }

  handleShowTagsDlg(groupId) {
    this.fetchTagsForGroup(groupId);
    this.setState({
      showTagsDlg: true,
      selectedGroupId: groupId,
    });
  }

  handleCloseTagsDlg() {
    this.setState({
      showTagsDlg: false,
      assignedTags: null,
      selectedGroupId: 0,
    });
  }

  handleShowUsersDlg(groupId) {
    this.fetchUsersForGroup(groupId);
    this.setState({
      showUsersDlg: true,
    });
  }

  handleCloseUsersDlg() {
    this.setState({
      showUsersDlg: false,
      assignedUsers: null,
    });
  }

  handleAddTag(groupId, tagId) {
    fetch(`/super/groups/${groupId}/tags?tag_id=${tagId}`, { method: 'POST' })
      .then(res => res.json())
      .then(() => {
        this.fetchTagsForGroup(groupId);
      });
  }

  handleDeleteTag(groupId, tagId) {
    fetch(`/super/groups/${groupId}/tags/${tagId}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        this.fetchTagsForGroup(groupId);
      });
  }

  fetchAllTags() {
    fetch('/super/tags', {
      headers: {
        Accept: 'application/json',
      },
    }).then(res => res.json())
      .then((res) => {
        this.setState(Object.assign({}, this.state, {
          tags: res,
        }));
      });
  }

  fetchTagsForGroup(groupId) {
    fetch(`/super/groups/${groupId}/tags?is_use=1`)
      .then(res => res.json())
      .then((res) => {
        this.setState(Object.assign({}, this.state, {
          assignedTags: res,
          selectedGroupId: groupId,
        }));
      });
  }

  fetchUsersForGroup(groupId) {
    fetch(`/super/groups/${groupId}/users?is_use=1`)
      .then(res => res.json())
      .then((res) => {
        this.setState(Object.assign({}, this.state, {
          assignedUsers: res,
        }));
      });
  }

  render() {
    const tagDlgData = this.state.tags.map(tag => ({
      id: tag.id,
      text: tag.name,
    }));

    const userDlgData = this.state.assignedUsers ? this.state.assignedUsers.map(user => ({
      id: user,
      name: user,
    })) : [];

    return (
      <div>
        <GroupCreator onCreateGroup={this.handleCreateGroup} />
        <GroupList
          groups={this.state.groups}
          onShowTagsClick={this.handleShowTagsDlg}
          onShowUsersClick={this.handleShowUsersDlg}
        />
        <MenusDialog
          show={this.state.showTagsDlg}
          onClose={this.handleCloseTagsDlg}
          tagId={this.state.selectedGroupId}
          loading={this.state.assignedTags == null}
          data={tagDlgData}
          selected={this.state.assignedTags}
          disabled={false}
          onAdd={this.handleAddTag}
          onDelete={this.handleDeleteTag}
        />
        <UsersDialog
          show={this.state.showUsersDlg}
          loading={this.state.assignedUsers == null}
          data={userDlgData}
          onClose={this.handleCloseUsersDlg}
        />
      </div>
    );
  }
}

GroupApp.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    is_use: PropTypes.bool,
    creator: PropTypes.string,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
  })).isRequired,
};
