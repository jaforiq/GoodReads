import { useSelector } from 'react-redux';
import emptyImage from '../assets/empty-folder.png';
import {  ButtonGroup, Card, CardBody, CardFooter, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { RootState } from '@/store/store';
import { useNavigate } from 'react-router-dom';



const BookCard = () => {
  const navigate = useNavigate();
  const bookState = useSelector((state: RootState) => state.book);
  //console.log('state: ', bookState);
  const handleCardClick = (bookId: number| undefined) => navigate(`/details/${bookId}`);


  return (
    <div className="w-full mt-5">
      <div className="flex flex-wrap justify-center items-center mx-auto w-full gap-8">
      {bookState.length > 0 && bookState.map((res) => (
      <Card className='cursor-pointer' maxW='sm' key={res.id}  onClick={() => handleCardClick(res.id)}>
        <CardBody>
          <Image
            className='m-auto h-[15rem]'
            src={res.thumbnailUrl ?? emptyImage}
            alt={res.title}
            objectFit='cover'
            borderRadius='lg'
          />
          <Stack mt='6' spacing='3'>
            <Heading size='md' className='max-h-[30px] truncate'>{res.title}</Heading>
            <Text className='h-[120px] overflow-scroll text-ellipsis[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>{res.details}</Text>
          </Stack>
        </CardBody>         
          <CardFooter>
            <ButtonGroup spacing='2'></ButtonGroup>
          </CardFooter>
      </Card>))}
      </div>
    </div>
  );
}

export default BookCard


// onClick={() => handleCardClick(res.id)}
// {res.userId === loginUserId ? (
//   <CardFooter>
//     <ButtonGroup spacing='2'>
//       <Button variant='solid' colorScheme='blue' onClick={async (e) => await handleEditClick(e, res.id)}>
//         Edit
//       </Button>
//       <Button variant='ghost' colorScheme='blue' onClick={async (e) => await handleDeleteClick(e, res.id)}>
//         Delete
//       </Button>
//     </ButtonGroup>
//   </CardFooter>
// ) :()}