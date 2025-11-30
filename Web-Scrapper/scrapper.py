import requests
from bs4 import BeautifulSoup
import csv
import time
import re

def scrape_newbreak_blog(base_url='https://newbreak.church/blog/', max_pages=17):
    """
    Scrape blog posts from Newbreak Church blog.
    
    Args:
        base_url (str): Base URL for the blog index.
        max_pages (int): Maximum number of pages to scrape (based on pagination).
    
    Returns:
        list: List of dicts with post data.
    """
    all_posts = []
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }  # Mimics a real browser
    
    for page in range(1, max_pages + 1):
        if page == 1:
            url = base_url
        else:
            url = f"{base_url}page/{page}/"
        
        print(f"Scraping page {page}: {url}")
        
        retries = 3
        for attempt in range(retries):
            try:
                response = requests.get(url, headers=headers, timeout=20)
                response.raise_for_status()
                soup = BeautifulSoup(response.content, 'lxml')
                
              
                post_headings = soup.find_all('h2')
                
                for h2 in post_headings:
                  
                    title_link = h2.find('a')
                    if title_link:
                        title = title_link.get_text(strip=True)
                        post_url = title_link['href']
                        if not post_url.startswith('http'):
                            post_url = 'https://newbreak.church' + post_url  
                        
                     
                        next_elem = h2.find_next_sibling()
                        date_text = next_elem.get_text(strip=True) if next_elem else ''
                       
                        date_match = re.search(r'(\w+ \d{1,2}, \d{4})', date_text)
                        date = date_match.group(1) if date_match else 'Unknown'
                        
                        post_data = {
                            'title': title,
                            'date': date,
                            'url': post_url
                        }
                        all_posts.append(post_data)
                        print(f"  - Found: {title} ({date})")
                
                print(f"  Page {page} complete: {len([p for p in all_posts if 'Unknown' not in p['date']])} posts so far")
                break  
                
            except requests.RequestException as e:
                print(f"  Attempt {attempt + 1} failed: {e}")
                if attempt < retries - 1:
                    time.sleep(2 ** attempt)  
                else:
                    print(f"  All retries failed for page {page}")
                    continue
        
        time.sleep(1) 
    
    return all_posts

def save_to_csv(posts, filename='newbreak_blog_posts.csv'):
    """
    Save scraped posts to CSV.
    """
    if not posts:
        print("No data to save.")
        return
    
    fieldnames = ['title', 'date', 'url']
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(posts)
    print(f"Saved {len(posts)} posts to {filename}")


if __name__ == "__main__":
    posts = scrape_newbreak_blog()
    save_to_csv(posts)
    print(f"\nScraping complete! Total posts: {len(posts)}")