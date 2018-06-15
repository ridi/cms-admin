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
      tagsLock: false,
      usersLock: false,
      selectedGroupId: 0,
    };
  }

  async componentDidMount() {
    this.fetchAllTags();
    this.fetchAllUsers();
  }

  handleCreateGroup = async (name, isUse) => {
    const data = {
      name,
      is_use: isUse,
    };

    await axios.post('/super/groups', data, {
      headers: {
        Accept: 'application/json',
      },
    });
    window.location.reload();
  };

  handleShowTagsDlg = (groupId) => {
    this.fetchTagsForGroup(groupId);
    this.setState({
      showTagsDlg: true,
      selectedGroupId: groupId,
    });
  };

  handleCloseTagsDlg = () => {
    this.setState({
      showTagsDlg: false,
      tagsAssigned: null,
      selectedGroupId: 0,
    });
  };

  handleShowUsersDlg = (groupId) => {
    this.fetchUsersForGroup(groupId);
    this.setState({
      showUsersDlg: true,
    });
  };

  handleCloseUsersDlg = () => {
    this.setState({
      showUsersDlg: false,
      usersAssigned: null,
    });
  };

  lockState = async (operation, stateKey) => {
    this.setState({ [stateKey] : true });
    await operation();
    this.setState({ [stateKey] : false });
  }

  handleAddTag = async (groupId, tagId) => {
    this.lockState(async () => {
      await axios.post(`/super/groups/${groupId}/tags`, {
        tag_id: tagId,
      });
      this.setState((prevState) => {
        return { tagsAssigned: [...prevState.tagsAssigned, tagId] };
      });
    }, 'tagsLock');
  };

  handleDeleteTag = async (groupId, tagId) => {
    this.lockState(async () => {
      await axios.delete(`/super/groups/${groupId}/tags/${tagId}`);
      this.setState((prevState) => {
        return { tagsAssigned: prevState.tagsAssigned.filter(tag => tag !== tagId) };
      });
    }, 'tagsLock');
  };

  handleAddUser = async (groupId, userId) => {
    this.lockState(async () => {
      await axios.post(`/super/groups/${groupId}/users`, { user_id: userId });
      this.setState((prevState) => {
        return { usersAssigned: [...prevState.usersAssigned, userId] };
      });
    }, 'usersLock');
  };

  handleDeleteUser = async (groupId, userId) => {
    this.lockState(async () => {
      await axios.delete(`/super/groups/${groupId}/users/${userId}`);
      this.setState((prevState) => {
        return { usersAssigned: prevState.usersAssigned.filter(user => user !== userId) };
      });
    }, 'usersLock');
  };

  fetchAllTags = async () => {
    const res = await axios.get('/super/tags', {
      headers: {
        Accept: 'application/json',
      },
    });

    this.setState({
      tags: res.data,
    });
  };

  fetchAllUsers = async () => {
    const res = await axios.get('/super/users', {
      headers: {
        Accept: 'application/json',
      },
      params: {
        per_page: 999,
      },
    });

    this.setState({
      users: res.data.users,
    });
  };

  fetchTagsForGroup = async (groupId) => {
    const res = await axios.get(`/super/groups/${groupId}/tags?is_use=1`);

    this.setState({
      tagsAssigned: res.data,
      selectedGroupId: groupId,
    });
  };

  fetchUsersForGroup = async (groupId) => {
    const res = await axios.get(`/super/groups/${groupId}/users?is_use=1`);

    this.setState({
      usersAssigned: res.data,
      selectedGroupId: groupId,
    });
  };

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
          disabled={this.state.tagsLock}
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
          disabled={this.state.usersLock}
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
