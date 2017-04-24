import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import TagMenuLogForm from './TagMenuLogForm';
import LogDetailDlg from './LogDetailDlg';

const ROW_PER_PAGE= 25;
const MAX_PAGE = 10;

class LogApp extends React.Component {
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
  }

  getLogPage(pageIndex) {
    axios.get(`/super/logs/user?page=${pageIndex}&per_page=${ROW_PER_PAGE}`, {
      headers: { 'Accept': 'application/json' }
    })
      .then((res) => {
        const data = res.data.rows;
        const pageEnd = Math.ceil(res.data.count/ROW_PER_PAGE);
        this.setState(Object.assign({}, this.state, {
          userLog: Object.assign({}, this.state.userLog, {
            datas: data,
            nowPage: pageIndex,
            pageEnd: pageEnd,
            loading: false,
          })
        }));
    })
    .catch((e) => {
      alert(e);
    });
  }

  getMenus() {
    if (this.menuSaved) {
      return Promise.resolve(this.menuSaved);
    }

    return axios('/super/menus').then(res => {
      this.menuSaved = res.data;
      return Promise.resolve(this.menuSaved)
    });
  }

  getTags() {
    if (this.tagSaved) {
      return Promise.resolve(this.tagSaved);
    }

    return axios('/super/tags').then(res => {
      this.tagSaved = res.data;
      return Promise.resolve(this.tagSaved)
    });
  }

  componentDidMount() {
    this.getLogPage(this.state.userLog.nowPage);
  }

  handleShowMenuChange = (srcMenu) => {
    if (!srcMenu) {
      this.setState(Object.assign({}, this.state, {
        menuLogDlg: Object.assign({}, this.state.menuLogDlg, {
          datas: [],
          loading: false,
        })
      }));
      return;
    }

    this.setState(Object.assign({}, this.state, {
      menuLogDlg: Object.assign({}, this.state.menuLogDlg, {
        show: true,
        loading: true,
      })
    }));

    const menuIds = srcMenu.menu_ids? srcMenu.menu_ids.split(',') : [];
    this.getMenus()
    .then((menus) => {
      const results = menus
                    .filter(menu => menuIds.indexOf(menu.id.toString())!==-1)
                    .map(menu => menu.menu_title);
      this.setState(Object.assign({}, this.state, {
        menuLogDlg: Object.assign({}, this.state.menuLogDlg, {
          datas: results,
          loading: false,
        })
      }));
    });
  };

  handleCloseMenuChange = () => {
    this.setState(Object.assign({}, this.state, {
      menuLogDlg: Object.assign({}, this.state.menuLogDlg, {
        show: false,
      })
    }));
  };

  handleShowTagChange = (srcTag) => {
    if (!srcTag) {
      this.setState(Object.assign({}, this.state, {
        tagLogDlg: Object.assign({}, this.state.tagLogDlg, {
          datas: [],
          loading: false,
        })
      }));
      return;
    }

    this.setState(Object.assign({}, this.state, {
      tagLogDlg: Object.assign({}, this.state.tagLogDlg, {
        show: true,
        loading: true,
      })
    }));

    const tagIds = srcTag.tag_ids? srcTag.tag_ids.split(','): [];
    this.getTags()
    .then((tags) => {
      const results = tags
                      .filter(tag => tagIds.indexOf(tag.id.toString())!==-1)
                      .map(tag => tag.name);
      this.setState(Object.assign({}, this.state, {
        tagLogDlg: Object.assign({}, this.state.tagLogDlg, {
          datas: results,
          loading: false,
        })
      }));
    });
  };

  handleCloseTagChange = () => {
    this.setState(Object.assign({}, this.state, {
      tagLogDlg: Object.assign({}, this.state.tagLogDlg, {
        show: false,
      })
    }));
  };

  handleSelectPage = (pageIndex) => {
    this.setState(Object.assign({}, this.state, {
      userLog: Object.assign({}, this.state.userLog, {
        loading: true,
      })
    }));
    this.getLogPage(pageIndex);
  };

  render() {
    const { nowPage, pageEnd, datas, loading } = this.state.userLog;
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
            onPrevPage={() => this.handleSelectPage(nowPage-1)}
            onNextPage={() => this.handleSelectPage(nowPage+1)}
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
