import React from 'react';
import PropTypes from 'prop-types';
import UserDetailForm from './UserDetailForm';
import UserPermissionForm from './UserPermissionForm';
import UserCpForm from './UserCpForm';

class UserEditApp extends React.Component {
  constructor() {
    super();
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(id) {
    if (!confirm('삭제하시겠습니까?')) {
      return;
    }

    $.ajax(`/super/users/${id}`,
      {
        type: 'delete',
        success: () => {
          alert('성공적으로 삭제되었습니다.');
          location.href = '/super/users';
        },
        error: (xhr, status, e) => {
          alert(e);
        },
      }
    );
  }

  renderDetailForm() {
    let { userDetail } = this.props;
    if (!userDetail) {
      userDetail = {};
    }
    const { id, name, team, is_use } = userDetail;
    return (
      <UserDetailForm id={id} name={name} team={team} is_use={is_use} />
    );
  }

  renderPermissionForm() {
    if (!this.props.userDetail || !this.props.userDetail.id) {
      return null;
    }

    const userTag = this.props.userTag? this.props.userTag.split(',') : [];
    const userMenu = this.props.userMenu? this.props.userMenu.split(',') : [];
    return (
      <UserPermissionForm id={this.props.userDetail.id} userTag={userTag} userMenu={userMenu}/>
    );
  }

  renderCpForm() {
    if (!this.props.userDetail || !this.props.userDetail.id) {
      return null;
    }

    return (
      <UserCpForm id={this.props.userDetail.id} />
    );
  }

  renderDeleteButton() {
    if (!this.props.userDetail || !this.props.userDetail.id) {
      return null;
    }

    return (
      <a className="btn btn-default btn-danger pull-right" onClick={() => { this.handleDelete(this.props.userDetail.id); }}>삭제</a>
    );
  }

  render() {
    return (
      <div>
        <div className="col-xs-12 col-md-6">
          {this.renderDetailForm()}
        </div>

        <div className="col-xs-12 col-md-6">
          {this.renderPermissionForm()}
          {this.renderCpForm()}
        </div>

        <div className="col-xs-12 pull-right">
          {this.renderDeleteButton()}
        </div>
      </div>
    );
  }
}

UserEditApp.propTypes = {
  admin_id: PropTypes.string.isRequired,
  userDetail: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    team: PropTypes.string,
    is_use: PropTypes.string,
  }).isRequired,
  userTag: PropTypes.string.isRequired,
  userMenu: PropTypes.string.isRequired,
};

export default UserEditApp;
