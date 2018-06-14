import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import GroupCreator from './GroupCreator';
import GroupList from './GroupList';
import SelectModal from '../components/SelectModal';

export default class GroupApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      groups: props.groups,
      showTagsDlg: false,
      showUsersDlg: false,
      tags: [],
      users: [],
      tagsAssigned: null,
      usersAssigned: null,
      selectedGroupId: 0,
    };
  }

  async componentDidMount() {
    this.fetchAllTags();
    this.fetchAllUsers();
  }

  handleCreateGroup = (name, isUse) => {
    const data = {
      name,
      is_use: isUse,
    };

    axios.post('/super/groups', data, {
      headers: {
        Accept: 'application/json',
      },
    }).then(() => {
      window.location.reload();
    });
  }

  handleShowTagsDlg = (groupId) => {
    this.fetchTagsForGroup(groupId);
    this.setState({
      showTagsDlg: true,
      selectedGroupId: groupId,
    });
  }

  handleCloseTagsDlg = () => {
    this.setState({
      showTagsDlg: false,
      tagsAssigned: null,
      selectedGroupId: 0,
    });
  }

  handleShowUsersDlg = (groupId) => {
    this.fetchUsersForGroup(groupId);
    this.setState({
      showUsersDlg: true,
    });
  }

  handleCloseUsersDlg = () => {
    this.setState({
      showUsersDlg: false,
      usersAssigned: null,
    });
  }

  handleAddTag = (groupId, tagId) => {
    axios.post(`/super/groups/${groupId}/tags`, {
      tag_id: tagId,
    }).then(() => {
      this.fetchTagsForGroup(groupId);
    }).catch((err) => {
      alert(err);
    });
  }

  handleDeleteTag = (groupId, tagId) => {
    axios.delete(`/super/groups/${groupId}/tags/${tagId}`)
      .then(() => {
        this.fetchTagsForGroup(groupId);
      }).catch((err) => {
        alert(err);
      });
  }

  handleAddUser = (groupId, userId) => {
    axios.post(`/super/groups/${groupId}/users`, { user_id: userId })
      .then(() => {
        this.fetchUsersForGroup(groupId);
      }).catch((err) => {
        alert(err);
      });
  }

  handleDeleteUser = (groupId, userId) => {
    axios.delete(`/super/groups/${groupId}/users/${userId}`)
      .then(() => {
        this.fetchUsersForGroup(groupId);
      }).catch((err) => {
        alert(err);
      });
  }

  fetchAllTags = () => {
    axios.get('/super/tags', {
      headers: {
        Accept: 'application/json',
      },
    }).then((res) => {
      this.setState({
        tags: res.data,
      });
    }).catch((err) => {
      alert(err);
    });
  }

  fetchAllUsers = () => {
    axios.get('/super/users', {
      headers: {
        Accept: 'application/json',
      },
      params: {
        per_page: 999,
      },
    }).then((res) => {
      this.setState({
        users: res.data.users,
      });
    }).catch((err) => {
      alert(err);
    });
  }

  fetchTagsForGroup = (groupId) => {
    axios.get(`/super/groups/${groupId}/tags?is_use=1`)
      .then((res) => {
        this.setState({
          tagsAssigned: res.data,
          selectedGroupId: groupId,
        });
      }).catch((err) => {
        alert(err);
      });
  }

  fetchUsersForGroup = (groupId) => {
    axios.get(`/super/groups/${groupId}/users?is_use=1`)
      .then((res) => {
        this.setState({
          usersAssigned: res.data,
          selectedGroupId: groupId,
        });
      }).catch((err) => {
        alert(err);
      });
  }

  render() {
    const tagDlgData = this.state.tags.map(tag => ({
      id: tag.id,
      text: tag.name,
    }));

    const userDlgData = this.state.users.map(user => ({
      id: user.id,
      text: user.name,
    }));

    return (
      <div>
        <GroupCreator onCreateGroup={this.handleCreateGroup} />
        <GroupList
          groups={this.state.groups}
          onShowTagsClick={this.handleShowTagsDlg}
          onShowUsersClick={this.handleShowUsersDlg}
        />
        <SelectModal
          title="태그 추가하기"
          show={this.state.showTagsDlg}
          onClose={this.handleCloseTagsDlg}
          subjectId={this.state.selectedGroupId}
          loading={this.state.tagsAssigned == null}
          data={tagDlgData}
          selectedItems={this.state.tagsAssigned}
          onAdd={this.handleAddTag}
          onDelete={this.handleDeleteTag}
        />
        <SelectModal
          title="사용자 추가하기"
          show={this.state.showUsersDlg}
          onClose={this.handleCloseUsersDlg}
          subjectId={this.state.selectedGroupId}
          loading={this.state.usersAssigned == null}
          data={userDlgData}
          selectedItems={this.state.usersAssigned}
          onAdd={this.handleAddUser}
          onDelete={this.handleDeleteUser}
        />
      </div>
    );
  }
}

GroupApp.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    is_use: PropTypes.number,
    creator: PropTypes.string,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
  })).isRequired,
};
