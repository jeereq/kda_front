import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const Feed = ({ type }) => {
  const [pins, setPins] = useState();
  const [loading, setLoading] = useState(false);
  const { Id } = useParams();

  useEffect(() => {
    if (Id) {
      setLoading(true);
      const query = searchQuery(Id, type);
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      setLoading(true);

      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [Id]);
  const ideaName = Id || 'nouvelle';
  if (loading) {
    return (
      <Spinner message={`Nous ajoutons des idées ${ideaName} à votre flux`} />
    );
  }
  return (
    <div>
      {pins && <MasonryLayout pins={pins} />}
      {pins?.length === 0 && (
        <div className="mt-10 text-center text-xl ">Pas de poste trouvé!</div>
      )}
    </div>
  );
};

export default Feed;
