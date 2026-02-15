import getSquaresBoard from '../aws/getSquaresBoard';

const handleGet = async (query) => {
    const { id, adminCode } = query;
    const { Item } = await getSquaresBoard(id);
    if (Item && adminCode) {
        return Item.adminCode === adminCode ? { Item } : { error: 'Admin code does not match.' };
    }
    if (Item) {
        return { Item };
    }
    return { error: `A Squares board with ID ${id} could not be found.` };
};

export default handleGet;
