import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { getIngredientByIdSelector } from '../../slices/ingredientReducer';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router';

export const IngredientDetails: FC = () => {
  const { id } = useParams();

  const ingredientData = useSelector((state) =>
    getIngredientByIdSelector(state, id)
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
