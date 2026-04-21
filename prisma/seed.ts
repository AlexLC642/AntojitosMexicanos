import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  { name: 'Hamburguesas', price: 25, category: 'Comida' },
  { name: 'Burritos', price: 25, category: 'Comida' },
  { name: 'Tacos (Orden)', price: 20, category: 'Comida' },
  { name: 'Gringas', price: 20, category: 'Comida' },
  { name: 'Poblanas', price: 20, category: 'Comida' },
  { name: 'Hot dogs', price: 15, category: 'Comida' },
  { name: 'Shucos', price: 15, category: 'Comida' },
  { name: 'Coca-Cola', price: 10, category: 'Bebidas' },
  { name: 'Fanta', price: 10, category: 'Bebidas' },
  { name: 'Licuados', price: 12, category: 'Bebidas' },
  { name: 'Té', price: 8, category: 'Bebidas' },
  { name: 'Café', price: 8, category: 'Bebidas' },
];

const scenarios = [
  { name: 'Lunes (Mañana)', lambda: 25, mu: 12, s: 2, duration: 180 },
  { name: 'Martes (Mediodía)', lambda: 38, mu: 14, s: 2, duration: 150 },
  { name: 'Miércoles (Pico Mañana)', lambda: 53, mu: 15, s: 3, duration: 90 },
  { name: 'Viernes (Pico Tarde)', lambda: 65, mu: 18, s: 4, duration: 120 },
  { name: 'Sábado (Pico Noche)', lambda: 60, mu: 18, s: 4, duration: 120 },
  { name: 'Escenario Base (Actual)', lambda: 45, mu: 15, s: 3, duration: 120 },
  { name: 'Escenario Menor Personal', lambda: 45, mu: 15, s: 2, duration: 120 },
  { name: 'Escenario Mayor Personal', lambda: 45, mu: 15, s: 4, duration: 120 },
  { name: 'Escenario Optimizado', lambda: 45, mu: 20, s: 3, duration: 120 },
];

async function main() {
  console.log('Iniciando el sembrado (seeding)...');

  // Limpiar base de datos existente
  await prisma.product.deleteMany();
  await prisma.scenario.deleteMany();

  // Insertar productos
  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  // Insertar escenarios
  for (const scenario of scenarios) {
    await prisma.scenario.create({ data: scenario });
  }

  console.log('Sembrado completado con éxito.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
