-- Create secrets table
create table if not exists secrets (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  secret text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies for secrets
alter table secrets enable row level security;

create policy "Only authenticated users can view secrets"
  on secrets for select
  to authenticated
  using (true);

-- Create get_secret function
create or replace function get_secret(name text)
returns text
language plpgsql
security definer
as $$
begin
  return (
    select secret
    from secrets
    where secrets.name = get_secret.name
    limit 1
  );
end;
$$;

-- Grant access to the function
grant execute on function get_secret to authenticated;