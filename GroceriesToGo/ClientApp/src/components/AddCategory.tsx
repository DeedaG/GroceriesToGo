import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as AddCategoryStore from '../store/AddCategory';
import PropTypes from 'prop-types';

type CategoryProps =
    AddCategoryStore.CategoryState // ... state we've requested from the Redux store
    & typeof AddCategoryStore.actionCreators // ... plus action creators we've requested

    & RouteComponentProps<{ Categorys?: string | undefined; Category?: string | undefined; id?: string | undefined; }>;

type myState = {
    id: number, date: string, cats: Array<AddCategoryStore.Category>,
    catName: string
}

class AddCategory extends React.PureComponent<CategoryProps, myState> {
    state: myState = {
        cats: this.props.cats,
        id: 0,
        date: "",
        catName: ""
    }

    static propTypes = {
        cats: PropTypes.array.isRequired,
        getCat: PropTypes.func.isRequired,
        addCat: PropTypes.func.isRequired,
        editCat: PropTypes.func.isRequired,
        deleteCat: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.props.getCat(this.state.cats);
    }

    submitData = () => {
        if (this.state.catName && this.state.date && !this.state.id) {
            const newcat = {
                id: Math.floor(Math.random() * (999 - 100 + 1) + 100),
                catName: this.state.catName,
                date: this.state.date,
            };

            this.props.addCat(newcat, this.props.history);
debugger
        } else if (this.state.catName && this.state.date && this.state.id) {
            const updatedDetails = {
                id: this.state.id,
                catName: this.state.catName,
                date: this.state.date,
            };

            this.props.editCat(updatedDetails, this.props.history);
        } else {
            alert('Enter category details.');
        }

        this.clearData();
    }

    editDetails = (cat: AddCategoryStore.Category) => {
        this.setState({
            id: cat.id,
            catName: cat.catName,
            date: cat.date
        })
    }

    deleteCat = (id: number) => {
        this.clearData();
        if (window.confirm("Are you sure?")) {
            this.props.deleteCat(id, this.props.history);
        }
    }

    handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            catName: e.target.value
        });
    }

    handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            date: e.target.value
        });
    }

    clearData = () => {
        this.setState({
            id: 0,
            catName: "",
            date: ""
        });
    }

    render() {
        return (
            <div>
                <header>
                    <h1>Add a new Category here</h1>
                </header>
                    <div>
                        Name : <input onChange={this.handleNameChange} value={this.state.catName} type="text" placeholder=" Name" /> <br />
                        Date :  <input onChange={this.handleDateChange} value={this.state.date} type="date" placeholder=" date" /><br />
                        {this.state.id ? <button onClick={this.submitData}>UPDATE</button> : <button onClick={this.submitData}>ADD</button>}   <button onClick={this.clearData}>CLEAR</button>
                    </div>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Date</th>
                                    <th>Action(s)</th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.state.cats.length > 0 ? (this.state.cats && this.state.cats.map((c, index) => {
                                    return <tr key={(index + 1)}>
                                        <td>{(index + 1)}</td>
                                        <td>{c.catName}</td>
                                        <td>{c.date}</td>
                                        <td><button onClick={() => this.editDetails(c)}>EDIT</button> <button onClick={() => this.deleteCat(c.id)}>DELETE</button> </td>
                                    </tr>
                                })) : null }
                            </tbody>
                        </table>
                    </div>
            </div>
        );
    }
}


export default connect(
    (state: ApplicationState) => state.AddCategory,// Selects which state properties are merged into the component's props
    AddCategoryStore.actionCreators // Selects which action creators are merged into the component's props
)(AddCategory as any);