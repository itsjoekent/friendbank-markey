# friendbank

A relational organizing tool originally developed for Ed Markey's 2020 senate re-elect.

More documentation and ways to help contribute coming soon!

----

Misc Frontend
- [ ] Document + Plug in new Spanish translations (1hr)

Transition
- [ ] Page migration
- [ ] Signups import script
- [ ] Custom "forgot password" email send for everyone that already made a page

Transition steps
1. Create new BSD page for phonebank signups
2. Export all signups from existing BSD signup form
3. Enable maintenance mode
4. Write edmarkey campaign to database
5. Migrate all pages
6. Create users
7. Import existing signups and attribute properly
8. Configure new ENV vars
9. Deploy app
10. Disable maintenance mode
11. Run "forgot password" script for all users that were imported
