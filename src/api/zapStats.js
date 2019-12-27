const stats = 'https://defizap-api.herokuapp.com/zaps';

export default async function ZapStats () {
    const res = await fetch(stats);
    return await res.json();
  };