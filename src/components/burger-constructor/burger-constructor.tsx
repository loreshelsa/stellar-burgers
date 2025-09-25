import { FC, useEffect, useMemo, useState } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  getBunsSelector,
  getIngredientsSelector,
  getLoadingNewOrderSelector,
  getNewOrderBurgerSelector,
  orderBurger,
  reset
} from '../../slices/orderReducer';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { authenticatedSelector } from '../../slices/authReducer';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderedIngredients = useSelector(getIngredientsSelector);
  const bun = useSelector(getBunsSelector);
  const isAuthenticated = useSelector(authenticatedSelector);

  const [constructorItems, setConstructorItems] = useState({
    bun: {
      price: 0
    },
    ingredients: []
  });

  useEffect(() => {
    if (orderedIngredients.length > 0 || bun) {
      const ingredients = orderedIngredients.filter(
        (item) => item.type !== 'bun'
      );

      setConstructorItems({
        bun: bun || {
          price: 0
        },
        ingredients: ingredients as []
      });
    }
  }, [orderedIngredients, bun]);

  const orderRequest = useSelector(getLoadingNewOrderSelector);

  const orderModalData = useSelector(getNewOrderBurgerSelector);

  const onOrderClick = () => {
    if (!isAuthenticated) {
      return navigate('/login');
    }
    if (!constructorItems.bun || orderRequest) return;
    const data = constructorItems.ingredients.map((item: any) => item._id);
    data.push((constructorItems.bun as Partial<TIngredient>)._id);
    data.push((constructorItems.bun as Partial<TIngredient>)._id);
    dispatch(orderBurger(data));
  };
  const closeOrderModal = () => {
    dispatch(reset());
    navigate('/feed');
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData || null}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
