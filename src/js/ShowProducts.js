import React from 'react';
import firebase, {db} from './firebase';
// import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import {lighten} from '@material-ui/core/styles/colorManipulator';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = theme => ({
    grow: {
        flexGrow: 1
    },
    root: {
        padding: theme.spacing.unit * 3,
        minWidth: 1550,
        width: '90%',
        margin: '0 auto'
        // textAlign: 'center',
    }
});

const ProductRows = props => (
    props.allProducts.map(product => (
        <TableRow key={product.SKU}>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>{product.price}</TableCell>
            <TableCell>{product.currency}</TableCell>
            <TableCell>{product.SKU}</TableCell>
            <TableCell>{product.imageUrl}</TableCell>
            <TableCell>{product.description}</TableCell>
            <TableCell>
                <IconButton onClick={props.handleEdit} variant={'extendedFab'}><i className='material-icons'>
                    edit
                </i></IconButton>
                {/*<IconButton onClick={handleDelete} variant={'extendedFab'}><i className='material-icons'>*/}
                {/*delete*/}
                {/*</i></IconButton>*/}
                <DeleteDialog SKU={product.SKU} category={product.category} handleDelete={props.handleDelete}/>
            </TableCell>
        </TableRow>
    ))
);

class DeleteDialog extends React.Component {
    state = {
        open: false,
    };

    handleClickOpen = () => {
        this.setState({open: true});
        console.log(this.props.SKU);
    };

    handleClose = () => {
        this.setState({open: false});
    };

    render() {
        return (
            <div>
                {/*<Button variant='outlined' onClick={this.handleClickOpen}>*/}
                {/*Open alert dialog*/}
                {/*</Button>*/}
                <IconButton onClick={this.handleClickOpen} variant={'extendedFab'}><i className='material-icons'>
                    delete
                </i></IconButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                >
                    <DialogTitle id='alert-dialog-title'>{'Delete'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id='alert-dialog-description'>
                            Delete selected product from database. This action is permanent.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color='primary' autoFocus>
                            Cancel
                        </Button>
                        <Button onClick={this.props.handleDelete(this.props.SKU, this.props.category)} color='primary'>
                            Delete
                        </Button>
                        {/*<Button onClick={this.handleClose} color='primary'>*/}
                            {/*Delete*/}
                        {/*</Button>*/}
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

class ShowProducts extends React.Component {
    state = {
        allProducts: []
        // hoodie: [],
        // tshirt: [],
        // tanktop: [],
        // jumper: [],
        // windbreaker: []
    };

    // // dzisiaj - na kategorie
    // getDataFromDb = categories => {
    //     categories.forEach(category => {
    //         const result = [];
    //         const name = category.replace('-', '');
    //
    //         db.collection(category).get().then(product => {
    //             product.forEach(property => result.push(property.data()));
    //             this.setState({
    //                 [name]: result
    //             });
    //         });
    //     });
    // };

    // dzisiaj - all in one
    getDataFromDb = categories => {
        const result = [];
        categories.forEach(category => {
            db.collection(category).get().then(product => {
                product.forEach(property => result.push(property.data()));
                this.setState({
                    allProducts: result
                });
            });
        });
    };

    handleEdit = (event) => {
        console.log(event.currentTarget);
        console.log(this);
    };

    handleDelete = (SKU, category) => () => {
        const newAllProducts = this.state.allProducts.filter(product => product.SKU !== SKU);
        this.setState({
            allProducts: newAllProducts
        });

        db.collection(category).doc(SKU).delete()
            .then(() => console.log('Product successfully deleted.'))
            .catch(error => console.log('Error removing product: ', error));
    };

    render() {
        const {classes} = this.props;
        console.log(this.state);

        let result;
        if (this.state.allProducts.length > 0) {
            result = (
                <React.Fragment>
                    <Paper className={classes.root}>
                        <Table>
                            <TableBody>
                                <ProductRows allProducts={this.state.allProducts}
                                             handleEdit={this.handleEdit}
                                             handleDelete={this.handleDelete}
                                />
                            </TableBody>
                        </Table>
                    </Paper>
                </React.Fragment>
            );
        } else {
            result = <CircularProgress/>;
        }

        return result;
    }

    componentDidMount() {
        this.getDataFromDb(['hoodie', 't-shirt', 'tank-top', 'jumper', 'windbreaker']);

    }
}

export default withStyles(styles)(ShowProducts);