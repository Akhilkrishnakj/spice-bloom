import React, { useState } from 'react'
import Layout from '../components/Layouts/Layout'
import "../index.css";

const Blog = () => {

  const blogData = [
    {
      id: 1,
      category: 'blended',
      title: 'Chilly Powder',
      img: 'https://imgs.search.brave.com/r6Phtn2VErFlFpeMH3MA1tfFvOf6Mq2XkFS356Rn4gU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/d2lkZW9wZW5jb3Vu/dHJ5LmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvc2l0ZXMvNC8y/MDIyLzA5L2NoaWxp/LXBvd2Rlci1hbmQt/Y2hpbGkucG5nP3Jl/c2l6ZT04NDAsNTYw',
      description: 'Chilly powder is a vibrant red spice known for its fiery heat and bold flavor. Used in countless Indian dishes, it adds depth and spice to curries, snacks, and marinades. Carefully ground from sun-dried red chilies, it\'s an essential ingredient in every kitchen that loves bold, spicy flavors.'
    },
    {
      id: 2,
      category: 'spices',
      title: 'Black Pepper',
      img: 'https://media.istockphoto.com/id/1318116927/photo/black-pepper-in-bowl.webp?a=1&b=1&s=612x612&w=0&k=20&c=ffARDTuPloJphhE5eb_nXWtsx-aQC-bFb72g97CFbsw=',
      description: 'Black pepper from Kerala, often called the \'King of Spices,\' is renowned for its bold flavor and rich aroma. Grown in the Western Ghats, Kerala’s black pepper is organic, sun-dried, and hand-picked. It\'s widely used in traditional dishes and Ayurveda for its digestive and medicinal properties.'
    },
    {
      id: 3,
      category: 'blended',
      title: 'Coriander Powder',
      img: "https://imgs.search.brave.com/0wgcpRs4jxWQjVEpB4jrSooR1SF0onXwSkMcTRJz7d4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTY2/MzcxMjI1MS9waG90/by9taWxkLWN1cnJ5/LXBvd2Rlci13aXRo/LXNlYXdlZWQtYW5k/LWJhc2lsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1nY0Ri/Vm5jVFNlN3RHa3Vp/QXZEaURpV21ELWh5/M2xjUmRkQjgyaUJs/Rkg4PQ",
      description: 'Coriander powder, made from ground coriander seeds, offers a mild, citrusy flavor that enhances both vegetarian and non-vegetarian dishes. It\'s a staple in Indian cooking, adding depth to curries, dals, and spice blends. Rich in antioxidants, it\'s valued for its digestive benefits and subtle aroma in traditional cuisines.'
    },
    {
      id: 4,
      category: 'spices',
      title: 'Cinnamon Sticks',
      img: 'https://imgs.search.brave.com/_djmsIbrvbj4vPhVQvDKZQUUh4dk9r-WNW6M4ChfNoA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzA0LzczLzk3/LzM2MF9GXzIwNDcz/OTc2MV9GeGRGeUVL/U2xRYVNNYjFueHU0/WVdIUXFyVHRQcWk3/dy5qcGc',
      description: 'Cinnamon sticks, known for their warm, sweet aroma and woody flavor, are a beloved spice in both sweet and savory dishes. Sourced from tree bark, they\'re commonly used in Indian desserts, teas, and biryanis. Rich in antioxidants, cinnamon supports heart health and adds a cozy touch to recipes.'
    },
    {
      id: 5,
      category: 'blended',
      title: 'Turmeric Powder',
      img: 'https://imgs.search.brave.com/DTQTZiSgM5kKuxJOHLcGVhNucuyVw6J2CyR7YbdxNIE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTEz/NTA5NjIzMy9waG90/by90dXJtZXJpYy1y/b290cy1hbmQtcG93/ZGVyLXNob3QtZnJv/bS1hYm92ZS5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9X2xZ/dzVWR2x4QlBUT3pX/MUJLZHVwaWgxTml4/U1lBNWEwTVp1SDBx/NUNXMD0',
      description: 'Turmeric powder, with its vibrant yellow hue and earthy flavor, is a staple in Indian cooking. Known for its powerful anti-inflammatory and antioxidant properties, it\'s often used in curries, rice, and health drinks. Sourced from dried turmeric roots, it\'s also valued in traditional medicine and skincare rituals.'
    },
    {
      id: 6,
      category: 'spices',
      title: 'Nutmug',
      img: 'https://imgs.search.brave.com/9Sni_ChLsUT8BtxIYA1F-9RtY4vgyBJLJ-f046ahvNU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNTg1/ODU4MDc5L3Bob3Rv/L251dG1lZ3MuanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPVlC/WGF6aVJfZzR5WDJY/XzlnMEVHdGxXQVVQ/T3dXRkcyaE1jNHdI/U0JXY0E9',
      description: 'Nutmeg is a warm, aromatic spice with a slightly sweet taste, used in both savory and sweet dishes. Derived from the seed of the Myristica fragrans tree, it\'s a key ingredient in spice blends and desserts. Nutmeg also offers medicinal benefits, aiding digestion and promoting relaxation and sleep.'
    },
    {
      id: 7,
      category: 'blended',
      title: 'Black Pepper Powder',
      img: 'https://imgs.search.brave.com/b5VyPDzrPGGFDacGPjDmY-xIiKxfiX3RKPXOuwxwYAE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTM3/NDAxOTI5OS9waG90/by9ncm91bmQtYmxh/Y2stcGVwcGVyLXNw/aWxsZWQtZnJvbS1h/LXRlYXNwb29uLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1S/TEFuTXVuYW03VDE4/Ni0wWV90U0E3QVpV/cWRkdlh6T1pKSUc1/eVNXX1dvPQ',
      description: 'Black pepper powder, often called the \"King of Spices,\" adds bold, pungent flavor to dishes. Sourced from sun-dried peppercorns, it\'s a staple in global cuisines. Rich in antioxidants, it enhances taste and supports digestion. A pinch of black pepper can transform both everyday meals and gourmet recipes.'
    },
    {
      id: 8,
      category: 'spices',
      title: 'Cloves',
      img: 'https://imgs.search.brave.com/Q6YRPA6QdvZw2nOSM7buUnNvWhTPA3hDZ-fr-dWbVpI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAzLzA0Lzg0LzEy/LzM2MF9GXzMwNDg0/MTI5OV9NVTFyRXdp/NEVESFAyRGlJblg1/VXhvbVlVTm5LUnJ6/ZS5qcGc',
      description: 'Cloves are aromatic flower buds with a warm, sweet, and slightly bitter flavor. Used in both sweet and savory dishes, they\'re essential in Indian biryanis, chai, and spice blends. Rich in antioxidants, cloves also support oral health and digestion. A tiny clove brings powerful taste and health benefits.'
    },
    {
      id: 9,
      category: 'blended',
      title: 'Cardamom Powder',
      img: 'https://imgs.search.brave.com/fCFKrQH9FhzrVNLHHVV9u4zlA-IdiiX8mGYQ0e4oeQI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTE2/NTU1OTg1OC9waG90/by9jYXJkYW1vbS1w/b2RzLWFuZC1jYXJk/YW1vbS1wb3dkZXIt/Y2xvc2UtdXAuanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPXNP/cUdvTVBJNHRwVm9r/dTYyUUs0b0ppQkZL/SjA2aEZTS0tjX09q/Ym13MlE9',
      description: 'Cardamom powder, known as the \"Queen of Spices,\" offers a sweet, floral aroma with hints of citrus. It\'s widely used in desserts, curries, and teas across South Asia. Rich in antioxidants, it aids digestion and freshens breath, making it both a flavorful and medicinal kitchen essential.'
    },
    {
      id: 10,
      category: 'spices',
      title: 'Coffee',
      img: 'https://imgs.search.brave.com/uBXoRN4RAHBTcGZf7vzf5-WGTwNcJ7BjlXurQ3pyRCg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNjI2/NTQ2MjkwL3Bob3Rv/L2NvZmZlZS1iZWFu/cy1hbmQtZ3JvdW5k/LWNvZmZlZS5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9VFF1/UEs5VFlWaGxnendL/SkxvbGRGeHRDWnJT/WV9yN2VtMFN2azMt/ajF5ND0',
      description: 'Coffee is a rich, aromatic beverage made from roasted coffee beans. Known for its bold flavor and caffeine boost, it energizes mornings worldwide. Whether brewed as espresso, filter, or instant, coffee stimulates the senses and enhances focus. It\'s a beloved daily ritual and a global cultural staple.'
    }
  ];

  const [filter, setFilter] = useState('all');
  const filteredBlogs = filter === "all" ? blogData : blogData.filter(blog => blog.category === filter);

  return (
    <Layout title={"Blogs - Spice Bloom"}>
      <div className='blog-container'>
        <h2>Our Spices Blogs</h2>
        <div className='filter-buttons'>
          <button onClick={() => setFilter('all')}>All</button>
          <button onClick={() => setFilter('spices')}>Spices</button>
          <button onClick={() => setFilter('blended')}>Blended</button>
        </div>

        <div className="blog-cards">
          {filteredBlogs.map(item => (
            <div className="blog-card" key={item.id}>
              <img src={item.img} alt={item.title} />
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Blog;
