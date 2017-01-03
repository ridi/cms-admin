import React from 'react';
import UserDetailForm from './UserDetailForm';
import UserPermissionForm from './UserPermissionForm';
import UserCpForm from './UserCpForm';

class UserEditApp extends React.Component {
  onDelete = (id) => {
    if (!confirm('삭제하시겠습니까?')) {
      return;
    }

    $.ajax('/super/users/'+id,
      {
        type: 'delete',
        success: function () {
          alert('성공적으로 삭제되었습니다.');
          location.href='/super/users';
        },
        error: function (xhr, status, e) {
          alert(e);
        }
      }
    );
  };

  renderDetailForm() {
    let { userDetail } = this.props;
    if (!userDetail) {
      userDetail = {};
    }
    const { id, name, team, is_use } = userDetail;
    return (
      <UserDetailForm id={id} name={name} team={team} is_use={is_use}/>
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

    const { admin_id } = this.props;
    return (
      <UserCpForm id={this.props.userDetail.id} admin_id={admin_id}/>
    );
  }

  renderDeleteButton() {
    if (!this.props.userDetail || !this.props.userDetail.id) {
      return null;
    }

    return (
      <a className="btn btn-default btn-danger pull-right" onClick={() => {this.onDelete(this.props.userDetail.id)}}>삭제</a>
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

export default UserEditApp;
