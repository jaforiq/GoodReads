import { Book } from '@/type/Book';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/services/showToast';
import emptyImage from '../assets/empty-folder.png';
import { deleteBook, findUserBook } from '@/services/bookServices';
import {  Button, ButtonGroup, Card, CardBody, CardFooter, Heading, Image, Stack, Text } from "@chakra-ui/react";

const MyBooks = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [books, setBooks] = useState<Book[]>([]);


  const fetchUserBook = async () =>{
    try{
      if(token){
      const response = await findUserBook(token);
      console.log("res: ", response);
      setBooks(response);
    }
  } catch(err){
    console.log(err);
    }
  }

  useEffect(()=> {
    fetchUserBook();
  }, [])

  const handleEditClick = (e: React.MouseEvent, bookId: number | undefined) => {
    e.stopPropagation();
    navigate(`/editbook/${bookId}`);
  }

  const handleDeleteClick = async (e: React.MouseEvent, bookId: number | undefined) => {
    e.stopPropagation();
    if(token){
      await deleteBook(bookId, token);
  
      const updatedBooks=  books.filter(e => e.id !== bookId);
      setBooks([...updatedBooks]);

      //console.log('books: ',books);
      showToast("Book Delete", "Book deleted successfully", 'warning');
    }
  }

  const handleCardClick = (bookId: number| undefined) => navigate(`/details/${bookId}`);
  return (
    <div className="w-full mt-5">
    <div className="flex flex-wrap justify-center items-center mx-auto w-full gap-8">
    {books.length > 0 ? (books.map((res) => (
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
          <ButtonGroup spacing='2'>
            <Button variant='solid' colorScheme='blue' onClick={async (e) => await handleEditClick(e, res.id)}>
              Edit
            </Button>
            <Button variant='ghost' colorScheme='blue' onClick={async (e) => await handleDeleteClick(e, res.id)}>
              Delete
            </Button>
          </ButtonGroup>
              </CardFooter>
        </Card>))) 
      : (
      <p>No books found</p>
      )}
    </div>
  </div>
  )
}

export default MyBooks