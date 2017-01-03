import React from 'react';

class UserDetailForm extends React.Component {
  onSave() {
    let $form = $('form');
    if ($form[0].checkValidity()) {
      $form.submit();
    }
  }

  render() {
    const { id, name, team, is_use } = this.props;

    return (
      <form className="form-horizontal" method="POST">
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h4 className="panel-title">유저 정보 관리</h4>
          </div>
          <div className="panel-body">
            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label">ID</label>
              <div className="col-xs-10">
                <input type="text" name="id" className="form-control" value={id} disabled={!!id} required/>
              </div>
            </div>

            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label">비밀번호</label>
              <div className="col-xs-10">
                <input type="password" name="passwd" className="form-control"/>
              </div>
            </div>

            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label">이름</label>
              <div className="col-xs-10">
                <input type="text" name="name" className="form-control" value={name} required/>
              </div>
            </div>

            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label">팀</label>
              <div className="col-xs-10">
                <input type="text" name="team" className="form-control" value={team} required/>
              </div>
            </div>

            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label">사용여부</label>
              <div className="col-xs-10">
                <select name="is_use" className="form-control" value={is_use}>
                  <option value='1'>Y</option>
                  <option value='0'>N</option>
                </select>
              </div>
            </div>

            <div className="btn-group btn-group-sm pull-right">
              <button type="submit" className="btn btn-default" id="btn_info_save" onClick={this.onSave.bind(this)}>
                <i className="glyphicon glyphicon-file"/> 저장
              </button>
              <button type="reset" className="btn btn-default">
                <i className="glyphicon glyphicon-repeat"/> 취소
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default UserDetailForm;
