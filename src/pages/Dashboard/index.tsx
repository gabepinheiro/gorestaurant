import { useState, useEffect } from 'react';

import { Header } from '../../components/Header';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';

import api from '../../services/api';

import { FoodsContainer } from './styles';

import { FoodType } from 'types';

export const Dashboard = () => {
  const [foods, setFoods] = useState<FoodType[]>([])
  const [editingFood, setEditingFood] = useState<FoodType | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModaOpen] = useState(false)

  useEffect(() => {
    const getFoods = async () => {
      const response = await api.get('/foods');
      setFoods(response.data);
    }

    getFoods()
  }, [])

  const handleAddFood = async (food: FoodType) => {
    try {
      const { data } = await api.post<FoodType>('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, data]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: FoodType) => {
    if(!editingFood) return 

    try {
      const foodUpdated = await api.put<FoodType>(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      setFoods(foods => foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      ));
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number)=> {
    await api.delete(`/foods/${id}`);

    setFoods(foods => foods.filter(food => food.id !== id));
  }

  const toggleModal = () => {
    setModalOpen(prevState => !prevState);
  }

  const toggleEditModal = () => {
    setEditModaOpen(prevState => !prevState);
  }

  const handleEditFood = (food: FoodType) => {
    setEditingFood(food)
    setEditModaOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />

      {editingFood && (
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />
      )}

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
