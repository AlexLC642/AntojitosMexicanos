import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  { name: 'Hamburguesas', price: 25, cost: 7.00, category: 'Comida' },
  { name: 'Burritos', price: 25, cost: 8.00, category: 'Comida' },
  { name: 'Tacos (Orden)', price: 20, cost: 6.50, category: 'Comida' },
  { name: 'Gringas', price: 20, cost: 7.50, category: 'Comida' },
  { name: 'Poblanas', price: 20, cost: 7.00, category: 'Comida' },
  { name: 'Hot dogs', price: 15, cost: 5.00, category: 'Comida' },
  { name: 'Shucos', price: 15, cost: 6.50, category: 'Comida' },
  { name: 'Coca-Cola', price: 10, cost: 6.50, category: 'Bebidas' },
  { name: 'Fanta', price: 10, cost: 6.50, category: 'Bebidas' },
  { name: 'Licuados', price: 12, cost: 5.00, category: 'Bebidas' },
  { name: 'Té', price: 8, cost: 1.35, category: 'Bebidas' },
  { name: 'Café', price: 8, cost: 2.00, category: 'Bebidas' },
];

const scenarios = [
  { name: 'Lunes (Mañana)', lambda: 20, mu: 12, s: 2, duration: 180 },
  { name: 'Martes (Mediodía)', lambda: 30, mu: 15, s: 3, duration: 150 },
  { name: 'Miércoles (Pico Mañana)', lambda: 45, mu: 15, s: 4, duration: 90 },
  { name: 'Viernes (Pico Tarde)', lambda: 65, mu: 20, s: 4, duration: 120 },
  { name: 'Sábado (Pico Noche)', lambda: 60, mu: 20, s: 4, duration: 120 },
  { name: 'Escenario Base (Actual)', lambda: 40, mu: 15, s: 3, duration: 120 },
  { name: 'Escenario Menor Personal', lambda: 25, mu: 15, s: 2, duration: 120 },
  { name: 'Escenario Mayor Personal', lambda: 45, mu: 15, s: 4, duration: 120 },
  { name: 'Escenario Optimizado', lambda: 50, mu: 20, s: 3, duration: 120 },
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
