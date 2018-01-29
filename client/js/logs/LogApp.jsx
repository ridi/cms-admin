import 'babel-polyfill';
import React from 'react';
import axios from 'axios';
import TagMenuLogForm from './TagMenuLogForm';
import LogDetailDlg from './LogDetailDlg';

const ROW_PER_PAGE = 25;
const MAX_PAGE = 10;

class LogApp extends React.Component {
  static async getLogPage(pageIndex) {
    const { data } = await axios.get(`/super/logs/user?page=${pageIndex}&per_page=${ROW_PER_PAGE}`, {
      headers: { Accept: 'application/json' },
    });

    return {
      rows: data.rows,
      pageEnd: Math.ceil(data.count / ROW_PER_PAGE),
    };
  }

  constructor() {
    super();

    this.menuSaved = undefined;
    this.tagSaved = undefined;

    this.state = {
      userLog: {
        nowPage: 1,
        pageEnd: 0,
        datas: [],
        loading: true,
      },
      menuLogDlg: {
        show: false,
        datas: [],
        loading: true,
      },
      tagLogDlg: {
        show: false,
        datas: [],
        loading: true,
      },
    };

    this.handleShowMenuChange = this.handleShowMenuChange.bind(this);
    this.handleCloseMenuChange = this.handleCloseMenuChange.bind(this);
    this.handleShowTagChange = this.handleShowTagChange.bind(this);
    this.handleCloseTagChange = this.handleCloseTagChange.bind(this);
    this.handleSelectPage = this.handleSelectPage.bind(this);
  }

  componentDidMount() {
    this.handleSelectPage(this.state.userLog.nowPage);
  }

  async getMenus() {
    if (!this.menuSaved) {
      const { data } = await axios('/super/menus');
      this.menuSaved = data;
    }

    return this.menuSaved;
  }

  async getTags() {
    if (!this.tagSaved) {
      const { data } = await axios('/super/tags');
      this.tagSaved = data;
    }

    return this.tagSaved;
  }

  async handleShowMenuChange(srcMenu) {
    if (!srcMenu) {
      this.setState({
        menuLogDlg: Object.assign({}, this.state.menuLogDlg, {
          datas: [],
          loading: false,
        }),
      });
      return;
    }

    this.setState({
      menuLogDlg: Object.assign({}, this.state.menuLogDlg, {
        show: true,
        loading: true,
      }),
    });


    const menuIds = srcMenu.menu_ids ? srcMenu.menu_ids.split(',') : [];
    const menus = await this.getMenus();
    const results = menus
      .filter(menu => menuIds.indexOf(menu.id.toString()) !== -1)
      .map(menu => ({ id: menu.id, title: `${menu.menu_title} [ ${menu.menu_url} ]` }));
    this.setState({
      menuLogDlg: Object.assign({}, this.state.menuLogDlg, {
        datas: results,
        loading: false,
      }),
    });
  }

  handleCloseMenuChange() {
    this.setState({
      menuLogDlg: Object.assign({}, this.state.menuLogDlg, {
        show: false,
      }),
    });
  }

  async handleShowTagChange(srcTag) {
    if (!srcTag) {
      this.setState({
        tagLogDlg: Object.assign({}, this.state.tagLogDlg, {
          datas: [],
          loading: false,
        }),
      });
      return;
    }

    this.setState({
      tagLogDlg: Object.assign({}, this.state.tagLogDlg, {
        show: true,
        loading: true,
      }),
    });

    const tagIds = srcTag.tag_ids ? srcTag.tag_ids.split(',') : [];
    const tags = await this.getTags();
    const results = tags
      .filter(tag => tagIds.indexOf(tag.id.toString()) !== -1)
      .map(tag => ({ id: tag.id, title: tag.name }));
    this.setState({
      tagLogDlg: Object.assign({}, this.state.tagLogDlg, {
        datas: results,
        loading: false,
      }),
    });
  }

  handleCloseTagChange() {
    this.setState({
      tagLogDlg: Object.assign({}, this.state.tagLogDlg, {
        show: false,
      }),
    });
  }

  async handleSelectPage(pageIndex) {
    if (!this.state.userLog.loading) {
      this.setState({
        userLog: Object.assign({}, this.state.userLog, {
          loading: true,
        }),
      });
    }

    const pageData = await this.getLogPage(pageIndex);
    this.setState({
      userLog: {
        datas: pageData.rows,
        nowPage: pageIndex,
        pageEnd: pageData.pageEnd,
        loading: false,
      },
    });
  }

  render() {
    const {
      nowPage, pageEnd, datas, loading,
    } = this.state.userLog;
    return (
      <div>
        <div className="col-xs-12 col-md-12">
          <TagMenuLogForm
            datas={datas}
            pageLength={MAX_PAGE}
            pageEnd={pageEnd}
            nowPage={nowPage}
            loading={loading}
            onShowMenuChange={this.handleShowMenuChange}
            onShowTagChange={this.handleShowTagChange}
            onSelectPage={this.handleSelectPage}
            onPrevPage={() => this.handleSelectPage(nowPage - 1)}
            onNextPage={() => this.handleSelectPage(nowPage + 1)}
          />
        </div>

        <LogDetailDlg
          title="메뉴 저장 내역"
          show={this.state.menuLogDlg.show}
          loading={this.state.menuLogDlg.loading}
          datas={this.state.menuLogDlg.datas}
          onClose={this.handleCloseMenuChange}
        />

        <LogDetailDlg
          title="태그 저장 내역"
          show={this.state.tagLogDlg.show}
          loading={this.state.tagLogDlg.loading}
          datas={this.state.tagLogDlg.datas}
          onClose={this.handleCloseTagChange}
        />

      </div>
    );
  }
}

export default LogApp;
