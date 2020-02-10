import React from 'react';
import userApi from '../apis/userApi';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = { users: [], youngest: [], toogle: false, toggleCheckbox: true, isUserSelected: false };
		this.checkbox = React.createRef();
		this.delbtn = React.createRef();
	}

	componentDidMount() {
		userApi.get('/?results=50').then((res) => {
			// console.log(res.data.results);
			this.setState({ users: res.data.results });
		});
	}

	renderList = () => {
		let userList = this.state.youngest.length ? this.state.youngest : this.state.users;
		return userList.map((item) => {
			return (
				<div className="item">
					<div className="right floated content">
						<div className="content">{item.dob.age}</div>
					</div>
					<div className="content">
						<pre>
							<input
								type="checkbox"
								name="select"
								ref={this.checkbox}
								checked={this.state.isUserSelected}
								onChange={this.handleUserSelection}
								hidden={this.state.toggleCheckbox}
							/>
							{item.name.first} {item.name.last}
						</pre>
					</div>
				</div>
			);
		});
	};

	handleUserSelection = () => {
		this.setState({ isUserSelected: !this.state.isUserSelected });
	};

	handleSort = () => {
		if (!this.state.toogle) {
			this.setState({
				users: this.state.users.sort((a, b) => {
					if (a.name.first.toLowerCase() < b.name.first.toLowerCase()) return -1;
					if (a.name.first.toLowerCase() > b.name.first.toLowerCase()) return 1;
					return 0;
				}),
				toogle: true,
				youngest: []
			});
		} else {
			this.setState({
				users: this.state.users.reverse(),
				toogle: false,
				youngest: []
			});
		}
	};

	handleYoungest = () => {
		let youngestPerson = [ ...this.state.users ];
		youngestPerson.sort((a, b) => {
			return a.dob.age - b.dob.age;
		});
		// console.log(youngestPerson.splice(0, 2));
		this.setState({ youngest: youngestPerson.splice(0, 2) });
	};

	handleEdit = () => {
		this.setState({ toggleCheckbox: !this.state.toggleCheckbox });
	};

	render() {
		console.log('RESULTS', this.state);
		return (
			<div className="ui container">
				<div className="ui inverted menu">
					<a className="yellow item" onClick={this.handleSort}>
						SORT
					</a>
					<a className="green item" onClick={this.handleYoungest}>
						YOUNGEST
					</a>
					<a className="blue item" onClick={this.handleEdit}>
						EDIT
					</a>
					<a className="red item disable" ref={this.delbtn}>
						DELETE
					</a>
				</div>
				<div className="ui middle aligned divided list">{this.renderList()}</div>
			</div>
		);
	}
}

export default App;
