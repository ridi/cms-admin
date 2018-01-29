import 'babel-polyfill';
import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';
import Select2Input from '../Select2Input';

class UserPermissionForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleMenuAdd = this.handleMenuAdd.bind(this);
    this.handleMenuRemove = this.handleMenuRemove.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleTagAdd = this.handleTagAdd.bind(this);
    this.handleTagRemove = this.handleTagRemove.bind(this);

    this.state = {
      tagFetching: true,
      tags: props.userTag,
      tagList: [],
      menuFetching: true,
      menus: props.userMenu,
      menuList: [],
    };
  }

  async componentDidMount() {
    await Promise.all([
      this.updateTags(),
      this.updateMenus(),
    ]);
  }

  async getTags() {
    const { data } = await axios('/super/tags');
    return data;
  }

  async getMenus() {
    const { data } = await axios('/super/menus');
    return data;
  }

  async updateTags() {
    const tags = await this.getTags();
    if (tags) {
      this.setState(Object.assign({}, this.state, {
        tagList: tags.map(tag => ({ id: tag.id, text: tag.name })),
        tagFetching: false,
      }));
    } else {
      this.setState(Object.assign({}, this.state, {
        tagFetching: false,
      }));
    }
  }

  async updateMenus() {
    const menus = await this.getMenus();
    if (menus) {
      this.setState(Object.assign({}, this.state, {
        menuList: menus.map((menu) => {
          const menuUrlArray = menu.menu_url.split('#');
          const text = menu.menu_title + (menuUrlArray[1] ? `#${menuUrlArray[1]}` : '');
          return { id: menu.id, text };
        }),
        menuFetching: false,
      }));
    } else {
      this.setState(Object.assign({}, this.state, {
        menuFetching: false,
      }));
    }
  }

  handleMenuAdd(id) {
    this.setState(Object.assign({}, this.state, {
      menus: this.state.menus.concat(id),
    }));
  }

  handleMenuRemove(id) {
    const targetIndex = this.state.menus.indexOf(id);
    if (targetIndex !== -1) {
      this.setState(Object.assign({}, this.state, {
        menus: this.state.menus.filter((_, i) => i !== targetIndex),
      }));
    }
  }

  handleTagAdd(id) {
    this.setState(Object.assign({}, this.state, {
      tags: this.state.tags.concat(id),
    }));
  }

  handleTagRemove(id) {
    const targetIndex = this.state.tags.indexOf(id);
    if (targetIndex !== -1) {
      this.setState(Object.assign({}, this.state, {
        tags: this.state.tags.filter((_, i) => i !== targetIndex),
      }));
    }
  }

  handleSave() {
    const form = new FormData();
    form.append('tag_ids', this.state.tags.join(','));
    form.append('menu_ids', this.state.menus.join(','));

    fetch(`/super/users/${this.props.id}/permissions`, {
      method: 'POST',
      credentials: 'include',
      body: form,
    }).then(() => {
      alert('성공적으로 업데이트 되었습니다.');
    }).catch(err => alert(err));
  }

  renderLoading() {
    return (
      <div className="progress">
        <div className="progress-bar progress-bar-striped active" style={{ width: '100%' }}>로딩중...</div>
      </div>
    );
  }

  renderTagInput(inputId) {
    const { id } = this.props;
    const { tags, tagList } = this.state;

    return (
      <Select2Input
        id={inputId}
        value={tags}
        data={tagList}
        multiple
        placeholder="태그를 지정하세요"
        disabled={!id}
        onAdd={this.handleTagAdd}
        onRemove={this.handleTagRemove}
      />
    );
  }

  renderMenuInput(inputId) {
    const { id } = this.props;
    const { menus, menuList } = this.state;

    return (
      <Select2Input
        id={inputId}
        value={menus}
        data={menuList}
        multiple
        placeholder="메뉴를 지정하세요"
        disabled={!id}
        onAdd={this.handleMenuAdd}
        onRemove={this.handleMenuRemove}
      />
    );
  }

  render() {
    const { id } = this.props;
    const { tagFetching, menuFetching } = this.state;

    return (
      <form className="form-horizontal" id="permissions" action={`/super/users/${id}/permissions`} method="POST">
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h4 className="panel-title">유저 권한 관리</h4>
          </div>
          <div className="panel-body">
            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label" htmlFor="tag_ids">태그</label>
              <div className="col-xs-10">
                {tagFetching ? this.renderLoading() : this.renderTagInput('tag_ids')}
              </div>
            </div>
            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label" htmlFor="menu_ids">메뉴</label>
              <div className="col-xs-10">
                {menuFetching ? this.renderLoading() : this.renderMenuInput('menu_ids')}
              </div>
            </div>
            <div className="btn-group btn-group-sm pull-right">
              <Button id="js_cp_update" className="btn btn-default" onClick={this.handleSave}>
                <i className="glyphicon glyphicon-file" /> 저장
              </Button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

UserPermissionForm.propTypes = {
  id: PropTypes.string.isRequired,
  userTag: PropTypes.arrayOf(PropTypes.string).isRequired,
  userMenu: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default UserPermissionForm;
