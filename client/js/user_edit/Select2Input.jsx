import React from 'react';

class Select2Input extends React.Component {
  renderInput() {
    if (this.props.fetching) {
      return (
        <div className="progress">
          <div className="progress-bar progress-bar-striped active" style={{'width':'100%'}}>로딩중...</div>
        </div>
      );

    } else {
      const { value } = this.props;

      return (
        <input type="hidden"
               ref={(input) => {this.selectInput = input}}
               className="form-control select2-offscreen"
               style={{'width':'100%'}}
               value={value}/>
      );
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data
     || prevProps.value !== this.props.value) {
      const {multiple, placeholder, tokenSeparators, data} = this.props;
      $(this.selectInput).select2({multiple, placeholder, tokenSeparators, data});
    }
  }

  render() {
    return (
      <div>
        { this.renderInput() }
      </div>
    );
  }
}

Select2Input.defaultProps = {
  fetching: false,
  value: [],
  data: [],
  multiple: true,
  placeholder: '',
  tokenSeparators: [','],
};

export default  Select2Input;
