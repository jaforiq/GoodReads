import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useNavigate } from 'react-router-dom';
import emptyImage from '../assets/empty-folder.png';
import {  ButtonGroup, Card, CardBody, CardFooter, Heading, Image, Stack, Text } from "@chakra-ui/react";


interface Props {
  isLoading: boolean;
}

const BookCard = ({ isLoading }: Props) => {
  const navigate = useNavigate();
  const bookState = useSelector((state: RootState) => state.book);
  const handleCardClick = (bookId: number| undefined) => navigate(`/details/${bookId}`);
  

  if (!isLoading && bookState.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center text-red-600">
        No book found
      </div>
    );
  }
  return (
    <div className="w-full mt-5 px-16">
      <div className="flex flex-wrap gap-8" style={{ margin: '0 -1rem' }}>
      {bookState.length > 0 && bookState.map((res) => (
      <div key={res.id} className="w-[390px] p-4">
        <Card className='cursor-pointer h-full' maxW='sm' key={res.id}  onClick={() => handleCardClick(res.id)}>
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
        </Card>
      </div>
      ))} 
      </div>
    </div>
  );
}

export default BookCard

