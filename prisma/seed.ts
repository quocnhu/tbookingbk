import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {

  const permissions = [
    'users.read',
    'users.create',
    'users.update',
    'users.delete',
  ]

  // Create permissions
  await prisma.permission.createMany({
    data: permissions.map((name) => ({ name })),
    skipDuplicates: true,
  })

  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  })

  const managerRole = await prisma.role.upsert({
    where: { name: 'manager' },
    update: {},
    create: { name: 'manager' },
  })

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user' },
  })

  const allPermissions = await prisma.permission.findMany()

  // Admin gets all permissions
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    })
  }

  const password = await bcrypt.hash('123456', 10)

  // Create users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      fullName: 'Admin',
      email: 'admin@test.com',
      password,
    },
  })

  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@test.com' },
    update: {},
    create: {
      fullName: 'Manager',
      email: 'manager@test.com',
      password,
    },
  })

  const normalUser = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      fullName: 'User',
      email: 'user@test.com',
      password,
    },
  })

  // Assign roles
  await prisma.userRole.createMany({
    data: [
      {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
      {
        userId: managerUser.id,
        roleId: managerRole.id,
      },
      {
        userId: normalUser.id,
        roleId: userRole.id,
      },
    ],
    skipDuplicates: true,
  })
}

main()