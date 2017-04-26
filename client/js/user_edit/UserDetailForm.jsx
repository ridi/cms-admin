import React from 'react';

class UserDetailForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      password: props.password,
      name: props.name,
      team: props.team,
      is_use: props.is_use,
    };

    this.handleReset = this.handleReset.bind(this);
    this.handleSave = this.handleSave.bind(this);

    this.initialState = this.state;
    this.isNewUser = !!props.id;
  }

  handleSave() {
    let $form = $('form');
    if ($form[0].checkValidity()) {
      $form.submit();
    }
  }

  handleReset() {
    this.setState(this.initialState);
  }

  render() {
    const { id, password, name, team, is_use } = this.state;

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
                <input
                  type="text" name="id" className="form-control"
                  value={id}
                  disabled={this.isNewUser}
                  onChange={(e) => {
                    this.setState(Object.assign({}, this.state, {
                      id: e.target.value,
                    }));
                  }}
                  required
                />
              </div>
            </div>

            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label">비밀번호</label>
              <div className="col-xs-10">
                <input
                  type="password" name="passwd" className="form-control"
                  value={password}
                  onChange={(e) => {
                    this.setState(Object.assign({}, this.state, {
                      password: e.target.value,
                    }));
                  }}
                />
              </div>
            </div>

            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label">이름</label>
              <div className="col-xs-10">
                <input
                  type="text" name="name" className="form-control"
                  value={name}
                  onChange={(e) => {
                    this.setState(Object.assign({}, this.state, {
                      name: e.target.value,
                    }));
                  }}
                  required
                />
              </div>
            </div>

            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label">팀</label>
              <div className="col-xs-10">
                <input
                  type="text" name="team" className="form-control"
                  value={team}
                  onChange={(e) => {
                    this.setState(Object.assign({}, this.state, {
                      team: e.target.value,
                    }));
                  }}
                  required
                />
              </div>
            </div>

            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label">사용여부</label>
              <div className="col-xs-10">
                <select
                  name="is_use" className="form-control"
                  value={is_use}
                  onChange={(e) => {
                    this.setState(Object.assign({}, this.state, {
                      is_use: e.target.value,
                    }));
                  }}
                >
                  <option value="1">Y</option>
                  <option value="0">N</option>
                </select>
              </div>
            </div>

            <div className="btn-group btn-group-sm pull-right">
              <button
                type="submit" className="btn btn-default" id="btn_info_save"
                onClick={this.handleSave}
              >
                <i className="glyphicon glyphicon-file" /> 저장
              </button>
              <button
                type="reset" className="btn btn-default"
                onClick={this.handleReset}
              >
                <i className="glyphicon glyphicon-repeat" /> 취소
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

UserDetailForm.defaultProps = {
  id: '',
  password: '',
  name: '',
  team: '',
  is_use: '1',
};

export default UserDetailForm;
