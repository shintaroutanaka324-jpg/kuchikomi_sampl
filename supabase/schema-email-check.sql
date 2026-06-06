-- 新規登録前のメール重複チェック用（schema.sql 実行後に実行）
-- auth.users を参照するため、フロントから確実に登録済みを判定できます

create or replace function public.is_email_registered(check_email text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from auth.users
    where lower(trim(email)) = lower(trim(check_email))
  );
$$;

revoke all on function public.is_email_registered(text) from public;
grant execute on function public.is_email_registered(text) to anon, authenticated;
