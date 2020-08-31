import axios from 'axios';
import Error from 'next/error';
import cookies from 'nookies';
import Thumbnail from '../../components/Thumbnail';

const Home = ({ shows, country, statusCode }) => {
  const renderShows = () => {
    if (statusCode) {
      return <Error statusCode={statusCode} />;
    }
    return shows.map((showItem, index) => {
      const { show } = showItem;
      return (
        <li key={index}>
          <Thumbnail
            imageUrl={show.image?.original}
            caption={show.name}
            href='/[country]/[showId]'
            as={`/${country}/${show.id}`}
          />
        </li>
      );
    });
  };
  return (
    <div className='home'>
      <ul className='tvshows-grid'>
        {renderShows()}
        <style jsx>{`
          .tvshows-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
        `}</style>
      </ul>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  try {
    const { defaultCountry } = cookies.get(context);
    const country = context.query.country || defaultCountry || 'us';

    const response = await axios.get(
      `https://api.tvmaze.com/schedule?country=${country}&date=2014-12-01`
    );
    return {
      props: { shows: response.data, country },
    };
  } catch (error) {
    return {
      props: { statusCode: error.response ? error.response.status : 500 },
    };
  }
};

export default Home;
