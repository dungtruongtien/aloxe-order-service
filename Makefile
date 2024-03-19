.PHONY: run-migrate
run-migrate:
	npx prisma migrate dev --name $(filter-out $@,$(MAKECMDGOALS))

.PHONY: run-prisma-generate
run-prisma-generate:
	npx prisma generate

.PHONY: run-dev
run-dev:
	npm run dev