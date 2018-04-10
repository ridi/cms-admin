import React from 'react';
import PropTypes from 'prop-types';

class UserDetailForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      password: props.password,
      name: props.name,
      team: props.team,
      isUse: props.isUse,
    };

    this.handleReset = this.handleReset.bind(this);
    this.handleSave = this.handleSave.bind(this);

    this.initialState = this.state;
    this.isNewUser = !!props.id;
  }

  handleSave() {
    const $form = $('form');
    if ($form[0].checkValidity()) {
      $form.submit();
    }
  }

  handleReset() {
    this.setState(this.initialState);
  }

  render() {
    const {
      id, password, name, team, isUse,
    } = this.state;

    return (
      <form className="form-horizontal" method="POST">
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h4 className="panel-title">유저 정보 관리</h4>
          </div>
          <div className="panel-body">
            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label" htmlFor="id">ID</label>
              <div className="col-xs-10">
                <input
                  id="id"
                  name="id"
                  type="text"
                  className="form-control"
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
              <label className="col-xs-2 control-label" htmlFor="passwd">비밀번호</label>
              <div className="col-xs-10">
                <input
                  id="passwd"
                  name="passwd"
                  type="password"
                  className="form-control"
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
              <label className="col-xs-2 control-label" htmlFor="name">이름</label>
              <div className="col-xs-10">
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-control"
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
              <label className="col-xs-2 control-label" htmlFor="team">팀</label>
              <div className="col-xs-10">
                <input
                  id="team"
                  name="team"
                  type="text"
                  className="form-control"
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
              <label className="col-xs-2 control-label" htmlFor="is_use">사용여부</label>
              <div className="col-xs-10">
                <select
                  id="is_use"
                  name="is_use"
                  className="form-control"
                  value={isUse}
                  onChange={(e) => {
                    this.setState(Object.assign({}, this.state, {
                      isUse: e.target.value,
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
                id="btn_info_save"
                type="submit"
                className="btn btn-default"
                onClick={this.handleSave}
              >
                <i className="glyphicon glyphicon-file" /> 저장
              </button>
              <button
                type="reset"
                className="btn btn-default"
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

UserDetailForm.propTypes = {
  id: PropTypes.string,
  password: PropTypes.string,
  name: PropTypes.string,
  team: PropTypes.string,
  isUse: PropTypes.string,
};

UserDetailForm.defaultProps = {
  id: '',
  password: '',
  name: '',
  team: '',
  isUse: '1',
};

export default UserDetailForm;
