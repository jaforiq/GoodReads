import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

const CreateBook = () => {
  const genreState = useSelector((state: RootState) => state.genre);
  console.log("genre:", genreState);
  return (
    <div>CreateBook</div>
  )
}

export default CreateBook