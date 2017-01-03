import React from 'react';
import axios from 'axios';
import Select2Input from './Select2Input';

class UserPermissionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tagFetching: true,
      tags: props.userTag,
      tagList: [],
      menuFetching: true,
      menues: props.userMenu,
      menuList: []
    };
  }

  componentDidMount() {
    axios('/super/tags')
    .then((res) => {
      let data = res.data;
      this.setState(Object.assign({}, this.state, {
        tagList: data.map((tag) => {
          return { id: tag.id, text: tag.name };
        }),
        tagFetching: false
      }));
    })
    .catch((e) => {
      alert(e);
    });

    axios('/super/menus')
    .then((res) => {
      let data = res.data;
      this.setState(Object.assign({}, this.state, {
        menuList: data.map((menu) => {
          const menu_url_array = menu.menu_url.split('#');
          const text = menu.menu_title + (menu_url_array[1] ? '#' + menu_url_array[1] : '');
          return { id: menu.id, text: text };
        }),
        menuFetching: false
      }));
    })
    .catch((e) => {
      alert(e);
    });
  }

  onMenuAdd = (id) => {
    this.setState(Object.assign({}, this.state, {
      menues: this.state.menues.concat(id)
    }));
  };

  onMenuRemove = (id) => {
    let targetIndex = this.state.menues.indexOf(id);
    if (targetIndex !== -1) {
      this.setState(Object.assign({}, this.state, {
        menues: this.state.menues.filter((_, i) => i!==targetIndex)
      }));
    }
  };

  onTagAdd = (id) => {
    this.setState(Object.assign({}, this.state, {
      tags: this.state.tags.concat(id)
    }));
  };

  onTagRemove = (id) => {
    let targetIndex = this.state.tags.indexOf(id);
    if (targetIndex !== -1) {
      this.setState(Object.assign({}, this.state, {
        tags: this.state.tags.filter((_, i) => i!==targetIndex)
      }));
    }
  };

  renderLoading() {
    return (
      <div className="progress">
        <div className="progress-bar progress-bar-striped active" style={{'width': '100%'}}>로딩중...</div>
      </div>
    )
  }

  renderTagInput() {
    const { id } = this.props;
    const { tags, tagList } = this.state;

    return (
      <Select2Input name="tag_ids"
                    value={tags}
                    data={tagList}
                    multiple={true}
                    placeholder="태그를 지정하세요"
                    disabled={!id}
                    onAdd={this.onTagAdd}
                    onRemove={this.onTagRemove}/>
    );
  }

  renderMenuInput() {
    const { id } = this.props;
    const { menues, menuList } = this.state;

    return (
      <Select2Input name="menu_ids"
                    value={menues}
                    data={menuList}
                    multiple={true}
                    placeholder="메뉴를 지정하세요"
                    disabled={!id}
                    onAdd={this.onMenuAdd}
                    onRemove={this.onMenuRemove}/>
    );
  }

  render() {
    const { id } = this.props;
    const { tagFetching, menuFetching } = this.state;

    return (
      <form className="form-horizontal" id="permissions" action={"/super/users/" + id + "/permissions"} method="POST">
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h4 className="panel-title">유저 권한 관리</h4>
          </div>
          <div className="panel-body">
            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label">태그</label>
              <div className="col-xs-10">
                {tagFetching? this.renderLoading() : this.renderTagInput()}
              </div>
            </div>
            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label">메뉴</label>
              <div className="col-xs-10">
                {menuFetching? this.renderLoading() : this.renderMenuInput()}
              </div>
            </div>
            <div className="btn-group btn-group-sm pull-right">
              <button type="submit" className="btn btn-default">
                <i className="glyphicon glyphicon-file"/> 저장
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default UserPermissionForm;
