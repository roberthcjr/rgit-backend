import { exec } from 'node:child_process';

function checkPostgres() {
  exec('docker exec database pg_isready --host localhost', handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search('accepting connections') === -1) {
      process.stdout.write('.');
      checkPostgres();
      return;
    }
    console.log('\nPostgres is accepting connections\n');
  }
}

process.stdout.write('\n\nWaiting to Postgres accept connections');
checkPostgres();
