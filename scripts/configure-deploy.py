#!/usr/bin/env python3
"""Merge supplied deployment settings without deleting existing OAuth secrets."""
import json
import os
from pathlib import Path
import secrets
from urllib.parse import urlparse

root = Path(__file__).resolve().parent.parent
env_file = root / '.env'
values = {}
if env_file.exists():
    for line in env_file.read_text().splitlines():
        if line and not line.startswith('#') and '=' in line:
            key, value = line.split('=', 1)
            # Files written by this script use JSON strings (Compose-compatible).
            try:
                values[key] = json.loads(value)
            except ValueError:
                values[key] = value.strip().strip("'\"")

for key in ('APP_URL', 'APP_KEY', 'GITHUB_OAUTH_CLIENT_ID',
            'GITHUB_OAUTH_CLIENT_SECRET', 'GITHUB_OAUTH_REDIRECT_URI'):
    if os.environ.get(key):
        values[key] = os.environ[key]

url = urlparse(values.get('APP_URL', ''))
if url.scheme != 'https' or not url.netloc or url.path not in ('', '/'):
    raise SystemExit('APP_URL must be the public HTTPS origin')
values.setdefault('GITHUB_OAUTH_REDIRECT_URI',
                  values['APP_URL'].rstrip('/') + '/api/user/login/github/callback')
values.setdefault('GITHUB_OAUTH_CLIENT_ID', '')
values.setdefault('GITHUB_OAUTH_CLIENT_SECRET', '')

production = root / 'config/production.json'
if not production.exists():
    production.parent.mkdir(parents=True, exist_ok=True)
    production.write_text((root / 'config/production.example.json').read_text())
production.chmod(0o600)
configured_key = json.loads(production.read_text()).get('appKey', '')
if not values.get('APP_KEY'):
    values['APP_KEY'] = (configured_key if len(configured_key) >= 32
                         and configured_key != 'REPLACE_WITH_RANDOM_HEX'
                         else secrets.token_hex(32))
if len(values['APP_KEY']) < 32:
    raise SystemExit('APP_KEY must contain at least 32 characters')
for key, value in values.items():
    if not isinstance(value, str) or any(char in value for char in '\r\n\x00'):
        raise SystemExit(f'Invalid environment value for {key}')

temporary = root / '.env.next'
temporary.touch(mode=0o600, exist_ok=True)
temporary.chmod(0o600)
temporary.write_text(''.join(f'{key}={json.dumps(value)}\n' for key, value in values.items()))
temporary.replace(env_file)
print('Runtime configuration saved; OAuth ' +
      ('configured' if values.get('GITHUB_OAUTH_CLIENT_ID') and values.get('GITHUB_OAUTH_CLIENT_SECRET')
       else 'awaiting GitHub OAuth App credentials'))
