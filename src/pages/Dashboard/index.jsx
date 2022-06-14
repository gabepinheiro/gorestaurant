import { useState, useEffect } from 'react';

import { Header } from '../../components/Header';
import api from '../../services/api';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export const Dashboard = () => {
  const [foods, setFoods] = useState([])
  const [editingFood, setEditingFood] = useState({})
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModaOpen] = useState(false)

  useEffect(() => {
    const getFoods = async () => {
      const response = await api.get('/foods');
      setFoods(response.data);
    }

    getFoods()
  }, [])

  const handleAddFood = async food => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async food => {
    try {
      const foodUpdated = await api.put(
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

  const handleDeleteFood = async id => {
    await api.delete(`/foods/${id}`);

    setFoods(foods => foods.filter(food => food.id !== id));
  }

  const toggleModal = () => {
    setModalOpen(prevState => !prevState);
  }

  const toggleEditModal = () => {
    setEditModaOpen(prevState => !prevState);
  }

  const handleEditFood = food => {
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
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

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
