export const API_URL='http://farmabracia.pl:3001';
export const API_URL2='http://192.168.1.3:3001';
//export const API_URL='http://localhost:3001';
export const headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
});


export function request(url, method, dataset) {
    return new Request(url, {
        method: method,
        headers: headers,
        mode: 'cors',
        body: JSON.stringify(dataset)
    });
}

export async function fetchWithFallback(url1, url2) {
  try {
      const response = await fetch(url1);
      if (!response.ok) throw new Error(`Failed with ${response.status}`);
      return await response.json();
  } catch (error) {
      console.warn(`First IP failed: ${error.message}, trying second IP...`);
      try {
          const response = await fetch(url2);
          if (!response.ok) throw new Error(`Failed with ${response.status}`);
          return await response.json();
      } catch (error) {
          console.error(`Both IPs failed: ${error.message}`);
          throw error; // Rethrow if both fail
      }
  }
}


export async function pingCheck(ip,port){
 let status=await fetch(request(`${API_URL}/pingcheck`, "POST", {ip:ip,port:port}))
  .then((res) => res.json())
  .then((result) => {
    console.log(result);
    return result.msg;
    }
  )
  .catch((error) => error);
  return status;
}