#!/bin/bash
export ORACLE_HOME=/usr/lib/oracle/21/client64/lib/network/admin
export TNS_ADMIN=/usr/lib/oracle/21/client64/lib/network/admin
cp sqlnet.ora $ORACLE_HOME/sqlnet.ora
cp tnsnames.ora $ORACLE_HOME/tnsnames.ora
cp listener.ora $ORACLE_HOME/listener.ora