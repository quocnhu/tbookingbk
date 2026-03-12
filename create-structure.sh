#!/bin/bash

# Navigate to src (optional if already there)
mkdir -p src
cd src

# ========================
# COMMON
# ========================
mkdir -p common/decorators
mkdir -p common/guards
mkdir -p common/interfaces
mkdir -p common/utils

touch common/decorators/public.decorator.ts
touch common/decorators/permissions.decorator.ts

touch common/guards/jwt-auth.guard.ts
touch common/guards/permissions.guard.ts

touch common/interfaces/jwt-payload.interface.ts

touch common/utils/hash.util.ts

# ========================
# AUTH
# ========================
mkdir -p auth/strategies
mkdir -p auth/dto

touch auth/auth.module.ts
touch auth/auth.controller.ts
touch auth/auth.service.ts

touch auth/strategies/jwt.strategy.ts

touch auth/dto/login.dto.ts
touch auth/dto/register.dto.ts

# ========================
# USERS
# ========================
mkdir -p users/dto

touch users/users.module.ts
touch users/users.controller.ts
touch users/users.service.ts

touch users/dto/create-user.dto.ts
touch users/dto/update-user.dto.ts

# ========================
# DASHBOARD
# ========================
mkdir -p dashboard

touch dashboard/dashboard.module.ts
touch dashboard/dashboard.controller.ts
touch dashboard/dashboard.service.ts

echo "Folder and file structure created successfully."