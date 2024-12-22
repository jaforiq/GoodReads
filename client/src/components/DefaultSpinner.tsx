import { Spinner } from '@chakra-ui/react';

const DefaultSpinner = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75">
        <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
        />
        </div>
    );
};
export default DefaultSpinner;