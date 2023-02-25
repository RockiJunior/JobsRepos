import React, { useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import PageHeader from 'components/common/PageHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FalconComponentCard from 'components/common/FalconComponentCard';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const data = [
  {
    id: 'droppable1',
    contents: [
      {
        id: 10000001,
        text: 'https://www.inmuebles24.com/noticias/wp-content/uploads/2020/01/departamentos-de-lujo-2.jpeg'
      },
      {
        id: 10000002,
        text: 'https://ingenieriacivilyarquitectura.com/wp-content/uploads/2021/11/diseno-de-interiores-de-departamentos-pequenos-1.jpg'
      },
      {
        id: 10000003,
        text: 'https://portomolino-departamentos.mx/wp-content/uploads/2021/12/portomolino-departamentos-mazatlan-banner-google-facebook-1.jpeg'
      }
    ]
  },

];

const DraggableComponent = () => {
  const [draggableData, setDraggableData] = useState(data);

  const getColumn = id => {
    return draggableData.find(item => item.id === id);
  };

  const reorder = (array, fromIndex, toIndex) => {
    const newArr = [...array];

    const chosenItem = newArr.splice(fromIndex, 1)[0];
    newArr.splice(toIndex, 0, chosenItem);

    return newArr;
  };

  const move = (source, destination) => {
    const sourceItemsClone = [...getColumn(source.droppableId).contents];
    const destItemsClone = [...getColumn(destination.droppableId).contents];

    const [removedItem] = sourceItemsClone.splice(source.index, 1);
    destItemsClone.splice(destination.index, 0, removedItem);

    return {
      updatedDestItems: destItemsClone,
      updatedSourceItems: sourceItemsClone
    };
  };

  const onDragEnd = result => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = getColumn(source.droppableId).contents;
      const reorderedItems = reorder(items, source.index, destination.index);
      const result = draggableData.map(item =>
        item.id === source.droppableId
          ? { ...item, contents: reorderedItems }
          : item
      );

      setDraggableData(result);
    } else {
      const sourceColumn = getColumn(source.droppableId);
      const destColumn = getColumn(destination.droppableId);
      const movedItems = move(source, destination);
      const result = draggableData.map(item => {
        return {
          ...item,
          contents:
            (item.id === sourceColumn.id && movedItems.updatedSourceItems) ||
            (item.id === destColumn.id && movedItems.updatedDestItems)
        };
      });

      setDraggableData(result);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Row>
        <Col lg={6}>
          <Droppable droppableId="droppable1" type="DRAG">
            {provided => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-primary dark__bg-1000 rounded-2 py-3 mb-3"
              >
                {draggableData[0].contents.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={`drag${item.id}`}
                    index={index}
                  >
                    {provided => (
                      <div>
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-3 kanban-item shadow-sm dark__bg-1100"
                        >
                          <Card.Body>
                            <img style={{width: 400}} src={item.text} alt=""/>                             
                          </Card.Body>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Col>
      </Row>
    </DragDropContext>
  );
};

const DraggableExample = () => (
  <>
    <PageHeader
      title="Draggable"
      description={`Beautiful and accessible drag and drop for lists with React`}
      className="mb-3"
    >
      <Button
        href={`https://github.com/atlassian/react-beautiful-dnd`}
        target="_blank"
        variant="link"
        size="sm"
        className="ps-0"
      >
        Draggable Documentation
        <FontAwesomeIcon icon="chevron-right" className="ms-1 fs--2" />
      </Button>
    </PageHeader>

    <FalconComponentCard>
      <FalconComponentCard.Header title="Example">
        <p className="mt-2 mb-0">
          Here is the example of the Multiple Container Sortable feature of the
          Draggable library. We also design{' '}
          <Link to="/app/kanban">Kanban Board</Link> using this Draggable
          Library.{' '}
          <b>You can drag any card in between the two columns below:</b>
        </p>
      </FalconComponentCard.Header>
      <FalconComponentCard.Body>
        <DraggableComponent />
      </FalconComponentCard.Body>
    </FalconComponentCard>
  </>
);

export default DraggableExample;
