export async function registerObject(broker, objectConfig){
   const res = await broker.call("objects.addObject", objectConfig);
   console.log('registerObject res', res);
   console.log('todo new object');
}