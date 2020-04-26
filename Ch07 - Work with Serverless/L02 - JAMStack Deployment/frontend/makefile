SHELL := /bin/bash

SERVICE = $(eval SERVICE := $(shell cut -d "=" -f 2 <<< $(shell cd ../backend && npm run env | grep "npm_package_name")))$(SERVICE)

deploy: check-env test

test:
	@echo "SERVICE $(SERVICE)"
	@echo "STACK_NAME $(STACK_NAME)"


check-env:
ifeq ($(call ifndef_any_of,STAGE STAGE_FLAG REGION),)
	$(eval STACK_NAME=$(shell echo $(SERVICE)-$(STAGE)))
else
	$(error STAGE, STAGE_FLAG, and REGION must be defined)
endif

ifndef_any_of = $(filter undefined,$(foreach v,$(1),$(origin $(v))))
ifdef_any_of = $(filter-out undefined,$(foreach v,$(1),$(origin $(v))))
